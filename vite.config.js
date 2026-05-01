import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  base: "/Super-Critter-Story/",
  build: {
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        pesquisa: fileURLToPath(new URL("./pesquisa.html", import.meta.url)),
      },
    },
  },
});
