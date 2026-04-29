const DAY_THEME_CLASS = "day-theme";

export function getCurrentTheme() {
  return document.body.classList.contains(DAY_THEME_CLASS) ? "day" : "night";
}

export function initThemeToggle({ onThemeChange } = {}) {
  const button = document.getElementById("theme-toggle");
  if (!button) return;

  const updateIcon = () => {
    button.textContent = getCurrentTheme() === "day" ? "🌙" : "☀️";
  };

  updateIcon();

  button.addEventListener("click", () => {
    document.body.classList.toggle(DAY_THEME_CLASS);
    updateIcon();
    onThemeChange?.(getCurrentTheme());
  });
}
