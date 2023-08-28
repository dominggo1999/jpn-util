import EPub from "epub2";
// import fs from "fs";
import util from "util";
import { html2text } from "./html2text";

import { resolve as r } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { db, books, chapters } from "db/drizzle";
import { generate as uuid } from "short-uuid";
import { readable } from "helpers";

const __filename = fileURLToPath(import.meta.url);
const dir = () => dirname(__filename);

const pathToFile = r(dir(), "./books/q.epub");
const imageWebRoot = r(dir(), "./books/images");
const chapterWebRoot = r(dir(), "./books/chapters");

// Promisify the epub.getChapter function
const getChapterAsync = util.promisify(EPub.prototype.getChapter);

const startTime = readable(new Date());

EPub.createAsync(pathToFile, imageWebRoot, chapterWebRoot)
  .then(async (results) => {
    const epub = results as EPub;
    const bookId = epub.metadata.title || uuid();

    db.insert(books)
      .values({
        bookId,
        title: epub.metadata.title,
      })
      .run();

    // const document = "";

    for (const chapter of epub.flow) {
      try {
        const text = await getChapterAsync.call(epub, chapter.id);
        html2text(text, chapter.id);
        // console.log(parseJp2Html(text, chapter.id));
        db.insert(chapters)
          .values({
            chapterId: chapter.id,
            bookId,
            title: chapter.title,
          })
          .run();
        // document += text;
      } catch (error) {
        console.log(error);
      }
    }

    // // Write document to a file
    // fs.writeFile(r(dir(), "./books/q.html"), document, (err) => {
    //   // handle error
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }

    //   console.log("file created");
    // });

    // Capture the end time
    const endTime = readable(new Date());

    // Calculate the elapsed time in milliseconds

    console.log(startTime, endTime);
  })
  .catch((err) => {
    console.log("ERROR\n-----");
    throw err;
  });
