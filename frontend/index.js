let storyControl;
let runControl;

/**
 * General initialization of the page
 */
document.addEventListener("DOMContentLoaded", (event) => {
  new MoodSelector();
  new ManualEntry();
  storyControl = new StoryControl();
  runControl = new RunControl();
});

/** events management for the whole module */
const events = {
  emit: async (eventType, data) => {
    switch (eventType) {
      case "FIRST_PROMPT":
        await storyControl.startNewBlock(data);
        break;
    }
  },
};

/**
 * Global ojbect for network calls
 */
const net = {
  async post(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });

    return response.json();
  },

  history: [],
};

/** Helper DOM methods */
const g = {
  Id(id) {
    return document.getElementById(id);
  },
  Class(className) {
    return document.getElementsByClassName(className);
  },
};

/** Parser of keywords for UI formatting */
const parser = {
  decode: (text) => {
    // Regular expression to match text within <key> tags
    const regex = /<key>(.*?)<\/key>/g;
    // Replace the matched <key> tags with a custom text
    return text.replace(regex, (_match, word) => {
      // Replace with the desired text
      return `<span class="keyword">${word}</span>`;
    });
  },
  clean: (text) => {
    const regex = /<key>(.*?)<\/key>/g;
    return text.replace(regex, (_match, word) => word);
  },
};
