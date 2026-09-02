import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  envDir: "./server",
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      // Exclude server-side files from Vite's HMR watcher
      // Otherwise every cart sync write to customers.json triggers an infinite reload loop
      ignored: ["**/server/**", "**/dist-server/**", "**/node_modules/**"],
    },
  },
});
