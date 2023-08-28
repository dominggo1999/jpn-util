import { Database } from "bun:sqlite";
import { drizzle, BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import * as schemas from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

const sqlite = new Database("./db/drizzle/sqlite.db");
export const db: BunSQLiteDatabase = drizzle(sqlite);

export const books = schemas.sqliteTable("books", {
  bookId: schemas.text("bookId").primaryKey(),
  title: schemas.text("title"),
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
  paragraphId: schemas.text("paragraphId").primaryKey(),
  text: schemas.text("text"),
  chapterId: schemas.text("chapterId").references(() => chapters.chapterId),
});

export const paragraphsRelations = relations(paragraphs, ({ many }) => ({
  furigana: many(furigana),
}));

export const furigana = schemas.sqliteTable("furigana", {
  furiganaId: schemas.text("furiganaId").primaryKey(),
  start: schemas.integer("start"),
  end: schemas.integer("end"),
  paragraphId: schemas
    .text("paragraphId")
    .references(() => paragraphs.paragraphId),
  kana: schemas.text("kana"),
});

// Create all tables with the correct columns
sqlite.run(
  `create table if not exists books (${["bookId text", "title text"].join(
    ",",
  )})`,
);
sqlite.run(
  `create table if not exists chapters (${[
    "chapterId text",
    "title text",
    "bookId text",
  ].join(",")})`,
);
sqlite.run(
  `create table if not exists paragraphs (${[
    "chapterId text",
    "paragraphId text",
    "text text",
  ].join(",")})`,
);
sqlite.run(
  `create table if not exists furigana (${[
    "furiganaId text",
    "start integer",
    "end integer",
    "paragraphId text",
    "kana text",
  ].join(",")})`,
);
