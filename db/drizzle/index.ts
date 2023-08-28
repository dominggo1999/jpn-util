import { Database } from "bun:sqlite";
import { drizzle, BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

export * from "./schema";

const sqlite = new Database("./db/drizzle/sqlite.db");
export const db: BunSQLiteDatabase = drizzle(sqlite);

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
    "position text",
  ].join(",")})`,
);
sqlite.run(
  `create table if not exists paragraphs (${[
    "chapterId text",
    "paragraphId text",
    "text text",
    "position text",
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
