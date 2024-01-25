import OpenAI from "openai";
import {
  buildSystemMsg,
  buildUserMsg,
  buildImagePrompt,
} from "./initPrompt.js";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import path from "path";
import fs from "fs";

const openai = new OpenAI();

export const newTextPrompt = async (
  mood: string,
  history: Array<ChatCompletionMessageParam>,
  word: string
) => {
  if (!history.length) {
    history.push(buildSystemMsg(mood));
  }
  history.push(buildUserMsg(word));

  const completion = await openai.chat.completions.create({
    messages: history,
    model: "gpt-4",
  });
  const newEntry = completion.choices[0].message;
  history.push(newEntry);

  return { history, newEntry };
};

export const newImagePrompt = async (
  mood: string,
  history: Array<ChatCompletionMessageParam>,
  word: string
) => {
  // only take story built by the assistant
  let storySoFar = history
    .filter((msg) => msg.role === "assistant")
    .map((msg) => msg.content)
    .join(" ");

  // clean formatting tags
  const regex = /<key>(.*?)<\/key>/g;
  storySoFar = storySoFar.replace(regex, (_match, word) => word);

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: buildImagePrompt(mood, storySoFar, word),
    n: 1,
    size: "1024x1024",
  });
  return response.data[0].url;
};

export const newAudioPrompt = async (
  gender: string,
  text: string,
  seed: string,
  count: number
) => {
  const speechFile = path.resolve(`../frontend/narration/speech-${count}.mp3`);
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: "Today is a wonderful day to build something people love!",
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
};
