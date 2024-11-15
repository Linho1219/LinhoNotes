// https://vitejs.dev/config/
import type { UserConfig } from "vite";
export default {
  build: {
    chunkSizeWarningLimit: 4096,
  },
} as UserConfig;
