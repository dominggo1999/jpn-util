import * as schemas from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const books = schemas.sqliteTable("books", {
  bookId: schemas.text("bookId").primaryKey(),
  title: schemas.text("title").notNull(),
});

export const booksRelations = relations(books, ({ many }) => ({
  chapters: many(chapters),
}));

export const chapters = schemas.sqliteTable("chapters", {
  chapterId: schemas.text("chapterId").primaryKey(),
  title: schemas.text("title"),
  bookId: schemas
    .text("bookId")
    .references(() => books.bookId)
    .notNull(),
});

export const chaptersRelations = relations(chapters, ({ many }) => ({
  paragraphs: many(paragraphs),
}));

export const paragraphs = schemas.sqliteTable("paragraphs", {
  paragraphId: schemas.text("paragraphId").primaryKey().notNull(),
  text: schemas.text("text").notNull(),
  chapterId: schemas
    .text("chapterId")
    .references(() => chapters.chapterId)
    .notNull(),
});

export const paragraphsRelations = relations(paragraphs, ({ many }) => ({
  furigana: many(furigana),
}));

export const furigana = schemas.sqliteTable("furigana", {
  furiganaId: schemas.text("furiganaId").primaryKey().notNull(),
  start: schemas.integer("start").notNull(),
  end: schemas.integer("end").notNull(),
  paragraphId: schemas
    .text("paragraphId")
    .references(() => paragraphs.paragraphId)
    .notNull(),
  kana: schemas.text("kana").notNull(),
});
