import { db, paragraphs, furigana } from "db/drizzle";
import { eq } from "drizzle-orm";
("");

console.log(
  db.select().from(paragraphs).where(eq(paragraphs.chapterId, "p-007")).all(),
);

console.log(
  db
    .select()
    .from(furigana)
    .where(eq(furigana.paragraphId, "88526c96-017d-433a-832d-995e6c93ec3b"))
    .all(),
);
