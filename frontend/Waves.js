class Waves {
  constructor() {
    this.currTarget = null;
    this.currAudio = null;
  }

  createWave(target, audio) {
    this.currTarget = target;
    this.currAudio = audio;

    const wavesurfer = WaveSurfer.create({
      container: target,
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
      url: audio,
    });

    wavesurfer.on("click", () => {
      wavesurfer.play();
    });
  }
}
