import EPub from "epub2";
// import fs from "fs";
import util from "util";
import { parseJp2Html } from "./html2text";

import { resolve as r } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const dir = () => dirname(__filename);

const pathToFile = r(dir(), "./books/q.epub");
const imageWebRoot = r(dir(), "./books/images");
const chapterWebRoot = r(dir(), "./books/chapters");

// Promisify the epub.getChapter function
const getChapterAsync = util.promisify(EPub.prototype.getChapter);

EPub.createAsync(pathToFile, imageWebRoot, chapterWebRoot)
  .then(async (results) => {
    const epub = results as EPub;

    // const document = "";

    for (const chapter of epub.flow) {
      try {
        const text = await getChapterAsync.call(epub, chapter.id);

        console.log(parseJp2Html(text));
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
  })
  .catch((err) => {
    console.log("ERROR\n-----");
    throw err;
  });
