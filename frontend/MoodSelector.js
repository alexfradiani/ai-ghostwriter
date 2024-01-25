class MoodSelector {
  constructor() {
    (async () => {
      await this.loadMoods();
    })();
  }

  async loadMoods() {
    const response = await fetch("moods");
    const moods = await response.json();

    let optionsHTML = [];
    moods.Moods.forEach((mood) => {
      optionsHTML.push(`<option value="${mood}">${mood}</option>`);
    });
    document.getElementById("MoodSelector").innerHTML = optionsHTML.join("\n");
  }
}
