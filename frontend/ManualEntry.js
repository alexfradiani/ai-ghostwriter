class ManualEntry {
  constructor() {
    g.Id("ManualEntry").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        runControl.clickRun();
      }
    });
  }
}
