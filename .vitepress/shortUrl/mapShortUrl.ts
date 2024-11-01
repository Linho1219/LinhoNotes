import md5 from "blueimp-md5";
import fs from "fs";
import type { SiteConfig } from "vitepress";

type ShortUrlMap = {
  [key: string]: string;
};

export default async function mapShortUrl(siteConfig: SiteConfig) {
  const shortMap: ShortUrlMap = {};
  siteConfig.pages.forEach((path) => {
    path = path.replace(/(index)?\.md$/, "");
    shortMap[md5(path).slice(0, 10)] = path;
  });
  try {
    fs.writeFileSync(
      `${siteConfig.outDir}/shortmap.json`,
      JSON.stringify(shortMap)
    );
  } catch (err) {
    console.error("Create sitemap.txt failed!", err);
  }
}
