import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  users, 
  content, 
  savedContent, 
  progress,
  type User, 
  type InsertUser,
  type Content,
  type InsertContent,
  type SavedContent,
  type InsertSavedContent,
  type Progress,
  type InsertProgress,
  type ContentWithProgress
} from "@shared/schema";
import { eq, and, desc, ilike, or } from "drizzle-orm";
import 'dotenv/config';


const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

const client = postgres(connectionString);
const db = drizzle(client);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Content methods
  getContent(id: string): Promise<Content | undefined>;
  searchContent(query: string, filters?: ContentFilters): Promise<ContentWithProgress[]>;
  createContent(content: InsertContent): Promise<Content>;
  getContentByExternalId(externalId: string, source: string): Promise<Content | undefined>;

  // Saved content methods
  saveContent(userId: string, contentId: string): Promise<SavedContent>;
  unsaveContent(userId: string, contentId: string): Promise<void>;
  getSavedContent(userId: string): Promise<ContentWithProgress[]>;
  isContentSaved(userId: string, contentId: string): Promise<boolean>;

  // Progress methods
  updateProgress(userId: string, contentId: string, status: string, progressPercentage: number): Promise<Progress>;
  getUserProgress(userId: string): Promise<Progress[]>;
  getContentProgress(userId: string, contentId: string): Promise<Progress | undefined>;
}

export interface ContentFilters {
  category?: string;
  contentType?: string;
  sortBy?: 'relevance' | 'date' | 'rating' | 'title';
  limit?: number;
  offset?: number;
}

export class PostgresStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getContent(id: string): Promise<Content | undefined> {
    const result = await db.select().from(content).where(eq(content.id, id)).limit(1);
    return result[0];
  }

  async searchContent(query: string, filters: ContentFilters = {}): Promise<ContentWithProgress[]> {
    // Build where conditions
    const conditions = [];
    
    if (query) {
      conditions.push(
        or(
          ilike(content.title, `%${query}%`),
          ilike(content.description, `%${query}%`),
          ilike(content.author, `%${query}%`)
        )
      );
    }

    if (filters.category) {
      conditions.push(eq(content.category, filters.category as any));
    }

    if (filters.contentType) {
      conditions.push(eq(content.contentType, filters.contentType as any));
    }

    // Start with base query
    let baseQuery = db.select().from(content);
    
    // Apply where conditions
    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions)) as any;
    }
    
    // Apply ordering
    switch (filters.sortBy) {
      case 'date':
        baseQuery = (baseQuery as any).orderBy(desc(content.createdAt));
        break;
      case 'rating':
        baseQuery = (baseQuery as any).orderBy(desc(content.rating));
        break;
      case 'title':
        baseQuery = (baseQuery as any).orderBy(content.title);
        break;
      default:
        baseQuery = (baseQuery as any).orderBy(desc(content.createdAt));
    }
    
    // Apply pagination
    if (filters.limit) {
      baseQuery = (baseQuery as any).limit(filters.limit);
    }

    if (filters.offset) {
      baseQuery = (baseQuery as any).offset(filters.offset);
    }

    const results = await baseQuery;
    return results.map((item: any) => ({ ...item, progress: undefined, isSaved: false }));
  }

  async createContent(contentData: InsertContent): Promise<Content> {
    const result = await db.insert(content).values(contentData).returning();
    return result[0];
  }

  async getContentByExternalId(externalId: string, source: string): Promise<Content | undefined> {
    const result = await db.select().from(content)
      .where(and(eq(content.externalId, externalId), eq(content.source, source)))
      .limit(1);
    return result[0];
  }

  async saveContent(userId: string, contentId: string): Promise<SavedContent> {
    const result = await db.insert(savedContent).values({ userId, contentId }).returning();
    return result[0];
  }

  async unsaveContent(userId: string, contentId: string): Promise<void> {
    await db.delete(savedContent)
      .where(and(eq(savedContent.userId, userId), eq(savedContent.contentId, contentId)));
  }

async getSavedContent(userId: string): Promise<ContentWithProgress[]> {
  const result = await db
    .select({
      id: content.id,
      title: content.title,
      description: content.description,
      url: content.url,
      imageUrl: content.imageUrl,
      source: content.source,
      externalId: content.externalId,
      contentType: content.contentType,
      category: content.category,
      rating: content.rating,
      author: content.author,
      createdAt: content.createdAt,
      // Progress fields
      progressId: progress.id,
      progressStatus: progress.status,
      progressPercentage: progress.progressPercentage,
      progressLastUpdated: progress.lastUpdated,
    })
    .from(savedContent)
    .innerJoin(content, eq(savedContent.contentId, content.id))
    .leftJoin(
      progress,
      and(
        eq(progress.contentId, content.id),
        eq(progress.userId, userId)
      )
    )
    .where(eq(savedContent.userId, userId))
    .orderBy(desc(savedContent.savedAt));

  return result.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    url: item.url,
    imageUrl: item.imageUrl,
    source: item.source,
    externalId: item.externalId,
    contentType: item.contentType,
    category: item.category,
    rating: item.rating,
    author: item.author,
    createdAt: item.createdAt,
    isSaved: true,
    progress: item.progressId
      ? {
          id: item.progressId,
          userId,
          contentId: item.id,
          status: item.progressStatus ?? 'not_started',
          progressPercentage: item.progressPercentage ?? 0,
          lastUpdated: item.progressLastUpdated ?? new Date(),
        }
      : undefined,
  }));
}

  async isContentSaved(userId: string, contentId: string): Promise<boolean> {
    const result = await db.select().from(savedContent)
      .where(and(eq(savedContent.userId, userId), eq(savedContent.contentId, contentId)))
      .limit(1);
    return result.length > 0;
  }

  async updateProgress(userId: string, contentId: string, status: string, progressPercentage: number): Promise<Progress> {
    const existing = await db.select().from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.contentId, contentId)))
      .limit(1);

    if (existing.length > 0) {
      const result = await db.update(progress)
        .set({ status: status as any, progressPercentage, lastUpdated: new Date() })
        .where(and(eq(progress.userId, userId), eq(progress.contentId, contentId)))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(progress)
        .values({ userId, contentId, status: status as any, progressPercentage })
        .returning();
      return result[0];
    }
  }

  async getUserProgress(userId: string): Promise<Progress[]> {
    return await db.select().from(progress)
      .where(eq(progress.userId, userId))
      .orderBy(desc(progress.lastUpdated));
  }

  async getContentProgress(userId: string, contentId: string): Promise<Progress | undefined> {
    const result = await db.select().from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.contentId, contentId)))
      .limit(1);
    return result[0];
  }
}

export const storage = new PostgresStorage();
