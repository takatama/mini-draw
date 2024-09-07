import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/main.js",
      name: "NanoPaint",
      formats: ["es", "umd"],
      fileName: (format) => `nano-paint.${format}.js`,
    },
  },
});
