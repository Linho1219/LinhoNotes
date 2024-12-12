// https://vitejs.dev/config/
import "dotenv/config";
import type { UserConfig } from "vite";
import addContributors from "./.vitepress/contributors/addContributors";
export default {
  build: {
    chunkSizeWarningLimit: 4096,
  },
  plugins:
    process.env.NODE_ENV === "production" && !process.env.DISABLE_CONTRIBUTORS
      ? [addContributors]
      : [],
} as UserConfig;
