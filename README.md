# Super Critter Story: Backyard Legends

Static Vite site for the Super Critter Story landing page.

## Development

```bash
npm install
npm run dev
```

The dev server runs on `127.0.0.1` by default.

## Build

```bash
npm run build
npm run preview
```

The Vite base path is configured as `/Super-Critter-Story/` for GitHub Pages.

## Structure

- `index.html` contains the semantic page markup.
- `src/styles/` contains the visual layers split by responsibility.
- `src/js/modules/` contains behavior for theme, scene effects, reveal animations, navigation, and ambient audio.
- `src/assets/` contains images and music used by the site.

## Audio Behavior

The ambient player attempts autoplay on load. Browsers commonly block autoplay with sound, so the player falls back to starting on the first user interaction. Day and night modes crossfade between their respective tracks when music is playing.
