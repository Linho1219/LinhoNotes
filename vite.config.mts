// https://vitejs.dev/config/
import "dotenv/config";
import type { UserConfig } from "vite";
import getContributorPlugin from "./.vitepress/contributors/addContributors";
export default {
  build: {    chunkSizeWarningLimit: 8192,
  },
  plugins:
    process.env.NODE_ENV === "production" && !process.env.DISABLE_CONTRIBUTORS
      ? [await getContributorPlugin()]
      : [],
} as UserConfig;
