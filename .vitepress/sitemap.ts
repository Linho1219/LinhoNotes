import fs from "fs";
import { SiteConfig } from "vitepress";
import { baseUrl } from "./util";

export default async function genreateSitemap(siteConfig: SiteConfig) {
  const siteMapArr = siteConfig.pages.map(
    (page) => `${baseUrl}/${encodeURI(page.replace(/\.md$/, ".html"))}`
  );
  try {
    fs.writeFileSync(`${siteConfig.outDir}/sitemap.txt`, siteMapArr.join("\n"));
  } catch (err) {
    console.error("create sitemap.txt failed!", err);
  }
}
