import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openLibraryService } from "./services/openLibraryService";
import { insertUserSchema, insertContentSchema, insertProgressSchema } from "@shared/schema";
import { z } from "zod";


export async function registerRoutes(app: Express): Promise<Server> {
  // Create a default user for demo purposes
  const createDefaultUser = async () => {
    try {
      const existingUser = await storage.getUserByEmail("demo@learnhub.com");
      if (!existingUser) {
        return await storage.createUser({
          name: "Demo User",
          email: "demo@learnhub.com"
        });
      }
      return existingUser;
    } catch (error) {
      console.error("Error creating default user:", error);
      return null;
    }
  };

  // Search content (combines OpenLibrary API and local content)
  app.get("/api/content/search", async (req, res) => {
    try {
      const { q: query, category, contentType, sortBy, limit = 20, offset = 0 } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }

      // Search local content first
      const localContent = await storage.searchContent(query, {
        category: category as string,
        contentType: contentType as string,
        sortBy: sortBy as any,
        limit: Math.min(parseInt(limit as string), 50),
        offset: parseInt(offset as string)
      });

      // Also search OpenLibrary API for books
      let externalContent = [];
      try {
        const openLibraryResults = await openLibraryService.searchBooks(query, 10);
        
        // Convert and save OpenLibrary results to our database
        for (const book of openLibraryResults.docs) {
          const existing = await storage.getContentByExternalId(book.key, 'openlibrary');
          if (!existing) {
            const contentData = openLibraryService.mapToContent(book);
            try {
              const saved = await storage.createContent(contentData);
              externalContent.push(saved);
            } catch (error) {
              console.error('Error saving OpenLibrary content:', error);
            }
          } else {
            externalContent.push(existing);
          }
        }
      } catch (error) {
        console.error('Error fetching from OpenLibrary:', error);
      }

      // Combine results
      const allContent = [...localContent, ...externalContent];

      res.json({
        content: allContent,
        total: allContent.length,
        hasMore: allContent.length >= parseInt(limit as string)
      });
    } catch (error) {
      console.error("Error searching content:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get saved content for user
  app.get("/api/content/saved", async (req, res) => {
    try {
      const user = await createDefaultUser();
      if (!user) {
        return res.status(500).json({ message: "Unable to create user session" });
      }

      const savedContent = await storage.getSavedContent(user.id);
      res.json(savedContent);
    } catch (error) {
      console.error("Error fetching saved content:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Save content
  app.post("/api/content/:id/save", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await createDefaultUser();
      
      if (!user) {
        return res.status(500).json({ message: "Unable to create user session" });
      }

      const content = await storage.getContent(id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      const isAlreadySaved = await storage.isContentSaved(user.id, id);
      if (isAlreadySaved) {
        return res.status(400).json({ message: "Content already saved" });
      }

      const savedContent = await storage.saveContent(user.id, id);
      res.json(savedContent);
    } catch (error) {
      console.error("Error saving content:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Unsave content
  app.delete("/api/content/:id/save", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await createDefaultUser();
      
      if (!user) {
        return res.status(500).json({ message: "Unable to create user session" });
      }

      await storage.unsaveContent(user.id, id);
      res.json({ message: "Content unsaved successfully" });
    } catch (error) {
      console.error("Error unsaving content:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user progress
  app.get("/api/progress", async (req, res) => {
    try {
      const user = await createDefaultUser();
      if (!user) {
        return res.status(500).json({ message: "Unable to create user session" });
      }

      const progress = await storage.getUserProgress(user.id);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update progress
  app.post("/api/content/:id/progress", async (req, res) => {
    try {
      const { id } = req.params;
      const progressSchema = z.object({
        status: z.enum(["not_started", "in_progress", "completed"]),
        progressPercentage: z.number().min(0).max(100)
      });

      const { status, progressPercentage } = progressSchema.parse(req.body);
      
      const user = await createDefaultUser();
      if (!user) {
        return res.status(500).json({ message: "Unable to create user session" });
      }

      const content = await storage.getContent(id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      const progress = await storage.updateProgress(user.id, id, status, progressPercentage);
      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get progress stats
  app.get("/api/progress/stats", async (req, res) => {
    try {
      const user = await createDefaultUser();
      if (!user) {
        return res.status(500).json({ message: "Unable to create user session" });
      }

      const allProgress = await storage.getUserProgress(user.id);
      const savedContent = await storage.getSavedContent(user.id);
      
      const completed = allProgress.filter(p => p.status === 'completed').length;
      const inProgress = allProgress.filter(p => p.status === 'in_progress').length;
      const totalProgress = allProgress.length > 0 
        ? Math.round(allProgress.reduce((sum, p) => sum + p.progressPercentage, 0) / allProgress.length)
        : 0;

      res.json({
        completed,
        inProgress,
        saved: savedContent.length,
        totalProgress
      });
    } catch (error) {
      console.error("Error fetching progress stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
