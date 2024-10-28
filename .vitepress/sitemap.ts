import fs from "fs";
import { SiteConfig } from "vitepress";

export default async function genreateSitemap(siteConfig: SiteConfig) {
  const baseURL = "https://notes.linho.cc";
  const siteMapArr = siteConfig.pages.map(
    (page) => `${baseURL}/${encodeURI(page.replace(/\.md$/, ".html"))}`
  );
  try {
    fs.writeFileSync(`${siteConfig.outDir}/sitemap.txt`, siteMapArr.join("\n"));
  } catch (err) {
    console.error("create sitemap.txt failed!", err);
  }
}
