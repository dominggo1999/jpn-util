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
sqlite.run(`create table books (${["bookId text", "title text"].join(",")})`);
sqlite.run(
  `create table chapters (${[
    "chapterId text",
    "title text",
    "bookId text",
  ].join(",")})`,
);
sqlite.run(
  `create table paragraphs (${[
    "chapterId text",
    "paragraphId text",
    "text text",
  ].join(",")})`,
);
sqlite.run(
  `create table furigana (${[
    "furiganaId text",
    "start integer",
    "end integer",
    "paragraphId text",
    "kana text",
  ].join(",")})`,
);

// Create a table with the correct columns
// db.createTable("books", books.columns);
// db.createTable("chapters", chapters.columns);
// db.createTable("paragraphs", paragraphs.columns);
// db.createTable("furigana", furigana.columns);

// Insert some data
// db.insert("books")
//   .values({
//     bookId: "book1",
//     title: "book1",
//   }")

// db.insert(books)
//   .values({
//     bookId: "book1",
//     title: "book1",
//   })
//   .run();

// db.insert(chapters)
//   .values({
//     chapterId: "chapter1",
//     title: "book1",
//     bookId: "book1",
//   })
//   .run();

// db.insert(paragraphs)
//   .values({
//     paragraphId: "paragraph1",
//     chapterId: "chapter1",
//   })
//   .run();

// db.insert(furigana)
//   .values({
//     start: 0,
//     end: 2,
//     paragraphId: "paragraph1",
//     furiganaId: "furigana1",
//   })
//   .run();

// get all furigana in paragraph1
// const main = async () => {
//   const book = await db.select().from(books).where(eq(books.bookId, "book1"));

//   console.log(book);
// };

// main();
