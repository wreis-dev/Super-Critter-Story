import { getCurrentTheme } from "./theme-toggle.js";

const FADE_MS = 1600;
const DEFAULT_VOLUME = 0.45;
const STORAGE_VOLUME = "critterAudioVolume";
const STORAGE_MUTED = "critterAudioMuted";
const AUTOPLAY_EVENTS = ["click", "keydown", "pointerdown", "touchstart"];

function clampVolume(value) {
  return Math.min(1, Math.max(0, value));
}

function readStoredVolume() {
  try {
    const storedVolume = Number.parseFloat(localStorage.getItem(STORAGE_VOLUME));
    const storedMuted = localStorage.getItem(STORAGE_MUTED) === "true";

    if (storedMuted) return 0;
    if (Number.isFinite(storedVolume)) return clampVolume(storedVolume);
  } catch {
    return DEFAULT_VOLUME;
  }

  return DEFAULT_VOLUME;
}

function saveVolume(volume) {
  try {
    localStorage.setItem(STORAGE_VOLUME, String(volume));
    localStorage.setItem(STORAGE_MUTED, String(volume <= 0.001));
  } catch {
    // Storage is optional; audio controls should continue to work without it.
  }
}

export function initAmbientPlayer() {
  const player = document.getElementById("ambient-player");
  const button = document.getElementById("ambient-toggle");
  const trackTitle = document.getElementById("ambient-title");
  const volumeControl = document.getElementById("ambient-volume");
  const dayAudio = document.getElementById("ambient-day-audio");
  const nightAudio = document.getElementById("ambient-night-audio");

  const noopApi = { syncWithTheme: () => {} };
  if (!player || !button || !trackTitle || !volumeControl || !dayAudio || !nightAudio) {
    return noopApi;
  }

  const tracks = {
    day: {
      audio: dayAudio,
      title: "Lenda no Milharal",
    },
    night: {
      audio: nightAudio,
      title: "Moonlit Backyard Legends",
    },
  };

  let currentTrack = getCurrentTheme();
  let isPlaying = false;
  let fadeFrame = null;
  let autoplayFallbackArmed = false;
  let baseVolume = readStoredVolume();

  volumeControl.value = String(baseVolume);

  function updatePlayerUi() {
    const track = tracks[currentTrack];

    player.dataset.themeTrack = currentTrack;
    player.dataset.playing = String(isPlaying);
    trackTitle.textContent = track.title;
    button.setAttribute("aria-pressed", String(isPlaying));
    button.setAttribute("aria-label", isPlaying ? "Pausar musica ambiente" : "Tocar musica ambiente");
    button.title = isPlaying ? "Pausar musica ambiente" : "Tocar musica ambiente";
  }

  function applyIdleVolumes() {
    Object.entries(tracks).forEach(([key, track]) => {
      track.audio.volume = key === currentTrack ? baseVolume : 0;
    });
  }

  function stopFade() {
    if (!fadeFrame) return;
    cancelAnimationFrame(fadeFrame);
    fadeFrame = null;
  }

  function pauseAllTracks() {
    stopFade();
    Object.values(tracks).forEach((track) => {
      track.audio.pause();
      track.audio.volume = 0;
    });
    tracks[currentTrack].audio.volume = baseVolume;
  }

  async function playCurrentTrack() {
    const activeAudio = tracks[currentTrack].audio;
    activeAudio.volume = baseVolume;
    await activeAudio.play();
  }

  function removeAutoplayFallback() {
    if (!autoplayFallbackArmed) return;
    AUTOPLAY_EVENTS.forEach((eventName) => {
      document.removeEventListener(eventName, handleAutoplayInteraction);
    });
    autoplayFallbackArmed = false;
  }

  function armAutoplayFallback() {
    if (autoplayFallbackArmed) return;
    autoplayFallbackArmed = true;
    AUTOPLAY_EVENTS.forEach((eventName) => {
      document.addEventListener(eventName, handleAutoplayInteraction, { once: true });
    });
  }

  async function tryStartPlayback({ useFallback = false } = {}) {
    try {
      await playCurrentTrack();
      isPlaying = true;
      removeAutoplayFallback();
    } catch (error) {
      isPlaying = false;
      if (useFallback) armAutoplayFallback();
      console.info("A musica ambiente aguardara a primeira interacao do usuario para iniciar.", error);
    }
    updatePlayerUi();
  }

  async function handleAutoplayInteraction() {
    removeAutoplayFallback();
    if (isPlaying) return;
    await tryStartPlayback({ useFallback: false });
  }

  function crossfadeTo(nextTrack, previousTrack) {
    stopFade();

    const fromAudio = tracks[previousTrack].audio;
    const toAudio = tracks[nextTrack].audio;

    toAudio.currentTime = 0;
    toAudio.volume = 0;
    toAudio.play()
      .then(() => {
        const startedAt = performance.now();

        function step(now) {
          const progress = Math.min(1, (now - startedAt) / FADE_MS);
          const eased = progress < 0.5
            ? 2 * progress * progress
            : 1 - ((-2 * progress + 2) ** 2) / 2;

          fromAudio.volume = baseVolume * (1 - eased);
          toAudio.volume = baseVolume * eased;

          if (progress < 1) {
            fadeFrame = requestAnimationFrame(step);
            return;
          }

          fromAudio.pause();
          fromAudio.currentTime = 0;
          fromAudio.volume = 0;
          toAudio.volume = baseVolume;
          fadeFrame = null;
        }

        fadeFrame = requestAnimationFrame(step);
      })
      .catch((error) => {
        console.warn("Nao foi possivel alternar a musica ambiente.", error);
        isPlaying = false;
        pauseAllTracks();
        updatePlayerUi();
      });
  }

  function syncWithTheme(nextTrack = getCurrentTheme()) {
    if (nextTrack === currentTrack) {
      updatePlayerUi();
      return;
    }

    const previousTrack = currentTrack;
    currentTrack = nextTrack;
    updatePlayerUi();

    if (!isPlaying) {
      tracks[previousTrack].audio.pause();
      applyIdleVolumes();
      return;
    }

    crossfadeTo(nextTrack, previousTrack);
  }

  button.addEventListener("click", async () => {
    if (isPlaying) {
      isPlaying = false;
      pauseAllTracks();
      updatePlayerUi();
      return;
    }

    await tryStartPlayback({ useFallback: false });
  });

  volumeControl.addEventListener("input", () => {
    const nextVolume = Number.parseFloat(volumeControl.value);
    baseVolume = Number.isFinite(nextVolume) ? clampVolume(nextVolume) : DEFAULT_VOLUME;
    saveVolume(baseVolume);
    if (!fadeFrame) applyIdleVolumes();
  });

  applyIdleVolumes();
  updatePlayerUi();
  tryStartPlayback({ useFallback: true });

  return {
    syncWithTheme,
  };
}
