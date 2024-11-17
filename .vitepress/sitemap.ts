import fs from "fs";
import { SiteConfig } from "vitepress";
import { globolConfig } from "./manualConfig";

/** 生成 txt 格式 sitemap */
export default async function genreateSitemap(siteConfig: SiteConfig) {
  const siteMapArr = siteConfig.pages.map(
    (page) =>
      `${globolConfig.baseUrl}/${encodeURI(page.replace(/(index)?\.md$/, ""))}`
  );
  try {
    fs.writeFileSync(`${siteConfig.outDir}/sitemap.txt`, siteMapArr.join("\n"));
  } catch (err) {
    console.error("Create sitemap.txt failed!", err);
  }
}
