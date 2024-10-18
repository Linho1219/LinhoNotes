import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { DefaultTheme } from "vitepress";

type IndexStructure = {
  layout: string;
  hero: {
    name: string;
    text?: string;
    tagline?: string;
    actions?: {
      theme: string;
      text: string;
      link: string;
    }[];
  };
  features: {
    title: string;
    detail: string;
    link: string;
  }[];
};

export default function sidebar() {
  const sidebarObj = {};
  const indexMD = <IndexStructure>yaml.load(
    fs
      .readFileSync("index.md", "utf-8")
      .trim()
      .replace(/\n---$/, "")
  );
  indexMD.features.forEach(({ link }) => {
    sidebarObj[link] = generateSidebar(link);
  });
  return sidebarObj;
}

function getMarkdownTitle(filePath: string): string {
  // const content = fs.readFileSync(filePath, "utf-8");
  // const match = content.match(/title:\s*(.*)/);
  // return match ? match[1] : path.basename(filePath, ".md");
  return path.basename(filePath, ".md");
}

function generateSidebar(dir: string): DefaultTheme.SidebarItem[] {
  const sidebar: DefaultTheme.SidebarItem[] = [];
  function compareFileName(a: string, b: string) {
    const matchA = a.match(/^((\d+)(\.(\d+))?)\s/),
      matchB = b.match(/^((\d+)(\.(\d+))?)\s/);
    if (matchA === null || matchB === null) return a.localeCompare(b);
    const NumberWithoutNaN = (str: string) =>
      isNaN(Number(str)) ? 0 : Number(str);
    const indexA = Number(matchA[2]) * 1000 + NumberWithoutNaN(matchA[4]),
      indexB = Number(matchB[2]) * 1000 + NumberWithoutNaN(matchB[4]);
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
  const dirLastName = dir.split("/").at(-1);
  if (folders.length !== 0) {
    // 文件夹模式
    folders.forEach((folder) => {
      const folderPath = path.join(dir, folder.name);
      const files = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".md"))
        .sort(compareFileName);
      sidebar.push({
        text: folder.name,
        items: files.map((file) => ({
          text: getMarkdownTitle(path.join(folderPath, file)),
          link: `/${dirLastName}/${folder.name}/${file}`,
        })),
      });
    });
  } else {
    // 文件模式
    fs.readdirSync(dir)
      .filter((file) => file.endsWith(".md") && file !== "index.md")
      .sort(compareFileName)
      .forEach((file) => {
        sidebar.push({
          text: path.basename(file, ".md"),
          link: dirLastName + "/" + path.basename(file, ".md"),
        });
      });
  }
  return sidebar;
}
