export function initNavigation() {
  const nav = document.getElementById("main-nav");
  if (!nav) return;

  const syncNavState = () => {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  };

  syncNavState();
  window.addEventListener("scroll", syncNavState, { passive: true });
}
