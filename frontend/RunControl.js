class RunControl {
  constructor() {
    // controlling flow of requests
    this.processing = false;

    g.Id("Run").addEventListener("click", this.clickRun);
  }

  /**
   * This resets the story, starts a new prompt history
   */
  clickRun() {
    if (this.processing) {
      return;
    }

    this.processing = true;
    g.Id("Run").disabled = true;

    const mood = g.Id("MoodSelector").value;
    const word = g.Id("ManualEntry").value;

    events.emit("FIRST_PROMPT", { mood, word });
  }

  finishProcessing() {
    this.processing = false;
    g.Id("Run").disabled = false;
  }
}
