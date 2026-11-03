import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backend = "http://localhost:3001";

export default defineConfig({
  plugins: [react()],
  // JSX lives in .js files (CRA convention)
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { ".js": "jsx" },
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": backend,
      "/socket.io": { target: backend, ws: true },
    },
  },
  build: {
    outDir: "build",
  },
});
