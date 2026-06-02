import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative base so the build works under a GitHub Pages project sub-path
  // (username.github.io/<repo>/) without hardcoding the repo name.
  base: "./",
  plugins: [react()],
});
