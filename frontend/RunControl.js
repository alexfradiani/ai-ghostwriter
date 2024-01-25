class RunControl {
  constructor() {
    g.Id("Run").addEventListener("click", this.clickRun);
  }

  /**
   * This resets the story, starts a new prompt history
   */
  clickRun() {
    const mood = g.Id("MoodSelector").value;
    const word = g.Id("ManualEntry").value;

    events.emit("FIRST_PROMPT", { mood, word });
  }
}
