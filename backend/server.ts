import express, { Request, Response } from "express";
import { Moods } from "./initPrompt.js";
import { newImagePrompt, newTextPrompt } from "./aiService.js";
const app = express();
const port = 3000;

app.use(express.static("../frontend"));
app.use(express.json());

app.get("/moods", (_req, res) => {
  res.json({ Moods });
});

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(__dirname + "../frontend/index.html");
});

app.post("/prompt", async (req: Request, res: Response) => {
  const { type, mood, history, word } = req.body;

  let response;
  switch (type) {
    case "text":
      response = await newTextPrompt(mood, history, word);
      res.json(response);
      return;

    case "image":
      response = await newImagePrompt(mood, history, word);
      res.json({ url: response });
      return;

    case "audio":
      return;
  }

  res.json({ error: "MissingType" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
