import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vueschool.io/articles/vuejs-tutorials/import-aliases-in-vite/
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
  },

  // https://vueschool.io/articles/vuejs-tutorials/import-aliases-in-vite/
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
