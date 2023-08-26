import express from "express";
import { kagomeTokenizer } from "../kagome";

const app = express();
app.use(express.json());

app.post("/tokenize", (req, res) => {
  const text = req.body.text;

  if (!text) {
    res.status(400).send("text is required");
    return;
  }

  if (typeof text !== "string") {
    res.status(400).send("text must be a string");
    return;
  }

  // text must be no longer than 5000 characters

  if (text.length > 5000) {
    res.status(400).send("text must be no longer than 5000 characters");
    return;
  }

  res.send(kagomeTokenizer(text));
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
