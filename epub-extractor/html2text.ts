import { load } from "cheerio";
import { generate as uuid } from "short-uuid";
import { db, paragraphs, furigana as furiganaModel } from "db/drizzle";
import { randomUUID } from "crypto";

const text = `
<p>
<ruby>
  <span xmlns="http://www.w3.org/1999/xhtml" class="koboSpan" id="kobo.3.1">藤宮 </span>
  <rt>ふじみや</rt>
</ruby>
<ruby>
  <span xmlns="http://www.w3.org/1999/xhtml" class="koboSpan" id="kobo.4.1">周 </span>
  <rt>あまね</rt>
</ruby>
<span xmlns="http://www.w3.org/1999/xhtml" class="koboSpan" id="kobo.5.1">が彼女── </span>
<ruby>
  <span xmlns="http://www.w3.org/1999/xhtml" class="koboSpan" id="kobo.6.1">椎名 </span>
  <rt>しいな</rt>
</ruby>
<ruby>
  <span xmlns="http://www.w3.org/1999/xhtml" class="koboSpan" id="kobo.7.1">真昼 </span>
  <rt>まひる</rt>
</ruby>
<span xmlns="http://www.w3.org/1999/xhtml" class="koboSpan"
  id="kobo.8.1">と初めて話したのは、雨が降りしきる中、公園でブランコに座っていた彼女を見かけた時だった。 </span>
</p>
<p>
<span xmlns="http://www.w3.org/1999/xhtml" class="koboSpan"
  id="kobo.9.1">今年高校一年生となり一人暮らしを始めた周が住むマンションの部屋の右隣には、天使が住んでいる。 </span>
</p>
<p>
<span xmlns="http://www.w3.org/1999/xhtml" class="koboSpan" id="kobo.10.1">天使というのはもちろん比喩であるが、その比喩が冗談ではないほどに椎名真昼は美しく
</span>
<ruby>
  <span xmlns="http://www.w3.org/1999/xhtml" class="koboSpan" id="kobo.11.1">可憐 </span>
  <rt>かれん</rt>
</ruby>
<span xmlns="http://www.w3.org/1999/xhtml" class="koboSpan" id="kobo.12.1">な少女だ。 </span>
</p>
`;

export type Furigana = {
  kana: string;
  start: number;
  end: number;
}[];

export type Paragraph = {
  text: string;
  furigana: Furigana;
};

export const parseJp2Html = (html: string, chapterId: string) => {
  const $ = load(html);

  // Get all the paragraphs
  const p = $("body > div.main >  p");

  const results = [];

  p.each((_, el) => {
    // For keeping track furigana index
    let index = 0;
    const furigana: Furigana = [];
    const paragraphId = randomUUID();

    // Get the children of the p tag and iterate on them
    const text = $(el)
      .children()
      .map((_, el) => {
        if (el.type === "tag") {
          const $el = $(el);

          // Check if element is ruby
          if ($el.is("ruby")) {
            // save the rt text to furigana
            const rt = $el.find("rt").text().trim();
            const prevIndex = index;

            // Get the span child using css selector
            const span = $el.find("span").text().trim();

            index += span.length;

            furigana.push({
              kana: rt,
              start: prevIndex,
              end: index - 1,
            });

            db.insert(furiganaModel)
              .values({
                paragraphId,
                furiganaId: uuid(),
                start: prevIndex,
                end: index - 1,
                kana: rt,
              })
              .run();

            return span;
          }

          // Check if element is span
          if ($el.is("span")) {
            const text = $el.text().trim();

            index += text.length;
            return text;
          }
        }

        return "";
      })
      .toArray()
      .join("");

    db.insert(paragraphs)
      .values({
        paragraphId,
        chapterId,
        text,
      })
      .run();

    console.log(chapterId, new Date().getTime());

    results.push({ text, furigana });
  });

  return results;
};

// console.log(parseJp2Html(text));
// parseJp2Html(text);
