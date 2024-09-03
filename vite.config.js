import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  assetsInclude: ["**/*.html", "**/*.css"],
  build: {
    lib: {
      entry: "src/main.js",
      name: "MiniDraw",
      fileName: (format) => `mini-draw.${format}.js`,
      formats: ["es", "umd"],
    },
  },
});
