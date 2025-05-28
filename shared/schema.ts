import { pgTable, text, serial, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const movies = pgTable("movies", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  overview: text("overview"),
  poster_path: text("poster_path"),
  backdrop_path: text("backdrop_path"),
  release_date: text("release_date"),
  vote_average: real("vote_average"),
  vote_count: integer("vote_count"),
  popularity: real("popularity"),
  adult: boolean("adult").default(false),
  video: boolean("video").default(false),
  original_language: text("original_language"),
  original_title: text("original_title"),
  genre_ids: text("genre_ids").array(),
});

export const genres = pgTable("genres", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
});

export const insertGenreSchema = createInsertSchema(genres).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Movie = typeof movies.$inferSelect;
export type Genre = typeof genres.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type InsertGenre = z.infer<typeof insertGenreSchema>;
