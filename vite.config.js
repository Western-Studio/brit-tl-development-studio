import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Served from https://western-studio.github.io/brit-tl-development-studio/
  base: "/brit-tl-development-studio/",
  plugins: [react()],
});
