// https://vitejs.dev/config/
import { defineConfig } from "vite";
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 4096,
  },
});
