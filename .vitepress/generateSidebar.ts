/** @format */

import fs from "fs";
import path from "path";
import { DefaultTheme } from "vitepress";

function getMarkdownTitle(filePath: string): string {
  // const content = fs.readFileSync(filePath, "utf-8");
  // const match = content.match(/title:\s*(.*)/);
  // return match ? match[1] : path.basename(filePath, ".md");
  return path.basename(filePath, ".md");
}

export function generateSidebar(dir: string): DefaultTheme.SidebarItem[] {
  const sidebar: DefaultTheme.SidebarItem[] = [];
  function compareFileName(a: string, b: string) {
    const matchA = a.match(/^(\d+)\.(\d+)\s/),
      matchB = b.match(/^(\d+)\.(\d+)\s/);
    if (matchA === null || matchB === null) {
      return a.localeCompare(b);
    }
    const indexA = Number(matchA[1]) * 1000 + Number(matchA[2]),
      indexB = Number(matchB[1]) * 1000 + Number(matchB[2]);
    return indexA - indexB;
  }

  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return sidebar;
  }
  const folders = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== "images")
    .sort((a, b) => compareFileName(a.name, b.name));

  if (folders.length !== 0)
    folders.forEach((folder) => {
      const folderPath = path.join(dir, folder.name);
      const files = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".md"))
        .sort(compareFileName);

      const path2 = dir.split("/").at(-1);
      const items = files.map((file) => {
        const filePath = path.join(folderPath, file);
        const title = getMarkdownTitle(filePath);
        return { text: title, link: `/${path2}/${folder.name}/${file}` };
      });

      sidebar.push({
        text: folder.name,
        items: items,
      });
    });
  else {
    fs.readdirSync(dir, { withFileTypes: true })
      .filter(
        (dirent) => dirent.name.endsWith(".md") && dirent.name !== "index.md"
      )
      .sort((a, b) => compareFileName(a.name, b.name))
      .forEach((file) => {
        sidebar.push({
          text: path.basename(file.name, ".md"),
          link: dir.split("/").at(-1) + "/" + path.basename(file.name, ".md"),
        });
      });
  }
  return sidebar;
}
