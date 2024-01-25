class StoryControl {
  constructor() {
    this.currContainer = null;
    this.currTextLoader = null;
    this.currImageLoader = null;
    this.currMood = null;
    this.currWord = null;

    g.Id("Reset").onclick = () => {
      net.history = [];

      this.currContainer = null;
      this.currTextLoader = null;
      this.currImageLoader = null;
      this.currMood = null;
      this.currWord = null;

      g.Id("Story").innerHTML = "";
      g.Id("Reset").classList.add("hidden");
    };
  }

  /**
   * Adds a new story block
   */
  async startNewBlock(data) {
    const { mood, word } = data;
    this.currMood = mood;
    this.currWord = word;

    const divContainer = document.createElement("div");
    if (this.currContainer) {
      this.cleanPrevBlock();
    }
    divContainer.classList.add("storyBlock");

    this.currImageLoader = this.createImgLoader();
    divContainer.appendChild(this.currImageLoader);

    this.currTextLoader = this.createTextLoader();
    divContainer.appendChild(this.currTextLoader);

    g.Id("Story").appendChild(divContainer);
    this.currContainer = divContainer;

    await Promise.all([this.textPrompt(), this.imagePrompt()]);
    this.enableReset();
  }

  async textPrompt() {
    const res = await net.post("/prompt", {
      type: "text",
      mood: this.currMood,
      history: net.history,
      word: this.currWord,
    });

    const newText = document.createElement("p");
    newText.classList.add("storyText");
    newText.innerHTML = "";
    this.typewrite(
      parser.decode(res.newEntry.content),
      parser.clean(res.newEntry.content),
      newText
    );
    this.currContainer.replaceChild(newText, this.currTextLoader);

    // update history after new text has been received
    net.history = res.history;
  }

  typewrite(formattedText, cleanText, element) {
    let i = 0;
    function type() {
      if (i < cleanText.length) {
        element.innerHTML += cleanText.charAt(i);
        i++;
        setTimeout(type, 50);
      }
      element.innerHTML = formattedText;
      this.refreshKeys();
    }
    type.bind(this)();
  }

  async imagePrompt() {
    const res = await net.post("/prompt", {
      type: "image",
      mood: this.currMood,
      history: net.history,
      word: this.currWord,
    });
    const html = `<img
        class="storyImg"
        src="${res.url}"
        alt="${this.currWord} image"
        width="256"
        height="256"
      />`;
    this.currImageLoader.innerHTML = html;
  }

  async audioPrompt() {}

  /**
   * Creates a loader for the image
   */
  createImgLoader() {
    const loaderContainer = document.createElement("div");
    loaderContainer.innerHTML = `
      <div class="loaderContainer">
        <div class="pulse"></div>
        <p>Loading new image</p>
      </div>
    `;

    return loaderContainer;
  }

  /**
   * Creates a loader for the text
   */
  createTextLoader() {
    const loaderContainer = document.createElement("div");
    loaderContainer.innerHTML = `
      <div class="loaderContainer">
        <div class="pulse"></div>
        <p>Loading new story text</p>
      </div>
    `;

    return loaderContainer;
  }

  cleanPrevBlock() {
    const keys = g.Class("keyword");
    while (keys.length > 0) {
      keys[0].onclick = null;
      keys[0].classList.remove("keyword");
    }
  }

  refreshKeys() {
    const keys = g.Class("keyword");
    for (let i = 0; i < keys.length; i++) {
      keys[i].onclick = () => {
        this.startNewBlock({ mood: this.currMood, word: keys[i].innerHTML });
      };
    }
  }

  enableReset() {
    g.Id("Reset").classList.remove("hidden");
  }
}
