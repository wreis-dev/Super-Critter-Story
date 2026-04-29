import { initAmbientPlayer } from "./modules/ambient-player.js";
import { initNavigation } from "./modules/navigation.js";
import { initReveal } from "./modules/reveal.js";
import { initSceneEffects } from "./modules/scene-effects.js";
import { initThemeToggle } from "./modules/theme-toggle.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initSceneEffects();
  initReveal();

  const ambientPlayer = initAmbientPlayer();
  initThemeToggle({
    onThemeChange: (theme) => ambientPlayer.syncWithTheme(theme),
  });
});
