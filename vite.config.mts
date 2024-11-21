// https://vitejs.dev/config/
import type { UserConfig } from "vite";
import addContributors from "./.vitepress/contributors/addContributors";
export default {
  build: {
    chunkSizeWarningLimit: 4096,
  },
  plugins: true ? [addContributors] : [],
} as UserConfig;
