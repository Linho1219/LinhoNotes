import fs from "fs";
import path from "path";
import { DefaultTheme } from "vitepress";

const ignProjects = [".vitepress", ".github", ".git", "node_modules", "public"];
const ignDirs = ["images"];
const ignFiles = ["index.md"];

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

const pangu = (str: string) =>
  str
    .replace(/([0-9A-Za-z&+\-])([\u4e00-\u9fff])/g, "$1 $2")
    .replace(/([\u4e00-\u9fff])([0-9A-Za-z&+\-])/g, "$1 $2");

function generateSidebar(dir: string): DefaultTheme.SidebarItem[] {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return [];
  }
  const folders = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !ignDirs.includes(dirent.name))
    .sort((a, b) => compareFileName(a.name, b.name));

  const generateItems = (folderPath: string) =>
    fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".md") && !ignFiles.includes(file))
      .sort(compareFileName)
      .map((file) => ({
        text: pangu(path.basename(file, ".md")),
        link: `/${folderPath}/${path.basename(file, ".md")}`,
      }));

  if (folders.length !== 0) {
    // 文件夹模式
    return folders.map((folder) => ({
      text: pangu(folder.name),
      items: generateItems(`${dir}/${folder.name}`),
    }));
  } else {
    // 文件模式
    return generateItems(dir);
  }
}

export default function sidebar() {
  const sidebarObj = {};
  fs.readdirSync("./", { withFileTypes: true })
    .filter(
      (dirent) => dirent.isDirectory() && !ignProjects.includes(dirent.name)
    )
    .forEach(({ name }) => (sidebarObj[name] = generateSidebar(name)));
  return sidebarObj;
}
