import {
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources/index.mjs";

export const Moods = [
  "happy",
  "sad",
  "angry",
  "scary",
  "thoughtful",
  "inspiring",
  "tragic",
  "funny",
  "hopeful",
  "hopeless",
  "spiritual",
  "stressful",
  "enthusiastic",
];

const getSystemPrompt = (mood: string) => {
  let str = `You are a creative short story writer. You will use the 
words given by the user to create a story with the following mood: ${mood}. Each 
time you respond you will complement the story so far with the new words from the user. 
Your response will be short, no more than 50 words, but no less than 20. In the 
text of your response you will pick three random words or phrases and wrap them 
in the tags <key></key>, because these words will be presented as options for the 
user to select how the story will continue. Always select words that are relevant 
within the sentence, like nouns, adjectives alongside nouns, or phrasal verbs, don't 
put the tags in conjunctions or words that have little meaning in the sentence. 
Also do not put the tags on words that were already used as keys. Especially don't 
put between key tags the same word used the user previously. Be as creative as 
you can and in general avoid reusing words, introduce new vocabulary as the 
story progresses. Play with characters and dialogue, make the story interesting! 
For example: if the user inputs the word: "dog", your response could be something 
like: "This is the story of a dog that had three <key>houses</key>, and he had to 
choose which one was his <key>favorite</key>. There was a long <key>road</key> 
that he needed to walk through". Notice how in this example the word "dog" 
was not used as a key tag, this is very important`;

  return str.replace(/(\r\n|\n|\r)/gm, "");
};

export const buildImagePrompt = (
  mood: string,
  history: string,
  word: string
) => {
  let str = `create an image to complement a short story, use as influence the 
illustration style common in fantasy and science fiction and the overall mood 
of this story which is: "${mood}". I will provide you with a target word or 
phrase, and with the story. Make the focus target the most important and biggest 
element in the composition, front and center, everything else is background. 
The focus of the image is the following word: "${word}". And this is the story 
so far: "${history}".`;

  return str.replace(/(\r\n|\n|\r)/gm, "");
};

export const buildSystemMsg = (
  mood: string
): ChatCompletionSystemMessageParam => {
  return { role: "system", content: getSystemPrompt(mood) };
};

export const buildUserMsg = (msg: string): ChatCompletionUserMessageParam => {
  return { role: "user", content: msg };
};
