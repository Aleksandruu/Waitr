import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  base: "/",
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    viteTsconfigPaths(),
    react(),
  ],
  server: {
    open: true,
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
});
