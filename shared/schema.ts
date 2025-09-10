import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contentTypeEnum = pgEnum("content_type", ["book", "article", "video", "course"]);
export const categoryEnum = pgEnum("category", ["programming", "design", "business", "science", "data-science", "web-dev", "ux-design", "python", "react"]);
export const progressStatusEnum = pgEnum("progress_status", ["not_started", "in_progress", "completed"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const content = pgTable("content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url"),
  imageUrl: text("image_url"),
  source: text("source").notNull(), // 'openlibrary', 'manual', etc.
  externalId: text("external_id"), // ID from external API
  contentType: contentTypeEnum("content_type").notNull(),
  category: categoryEnum("category"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  author: text("author"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedContent = pgTable("saved_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  contentId: varchar("content_id").references(() => content.id).notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});

export const progress = pgTable("progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  contentId: varchar("content_id").references(() => content.id).notNull(),
  status: progressStatusEnum("status").default("not_started").notNull(),
  progressPercentage: integer("progress_percentage").default(0).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
});

export const insertSavedContentSchema = createInsertSchema(savedContent).omit({
  id: true,
  savedAt: true,
});

export const insertProgressSchema = createInsertSchema(progress).omit({
  id: true,
  lastUpdated: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof content.$inferSelect;
export type InsertSavedContent = z.infer<typeof insertSavedContentSchema>;
export type SavedContent = typeof savedContent.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progress.$inferSelect;

export type ContentWithProgress = Content & {
  progress?: Progress;
  isSaved?: boolean;
};
