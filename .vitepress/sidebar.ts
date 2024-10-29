import fs from "fs";
import path from "path";
import { DefaultTheme } from "vitepress";
import { pangu } from "./util";

const ignProjects = [".vitepress", ".github", ".git", "node_modules", "public"];
const ignDirs = ["images"];
const ignFiles = ["index.md"];
const MAX_DEPTH = 2;

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

function generateSidebar(
  folderPath: string,
  depth = 0
): DefaultTheme.SidebarItem[] {
  if (!fs.existsSync(folderPath)) {
    console.error(`Directory not found: ${folderPath}`);
    return [];
  }
  const content = fs.readdirSync(folderPath, { withFileTypes: true });
  const folders =
    depth < MAX_DEPTH
      ? content.filter(
          (dirent) => dirent.isDirectory() && !ignDirs.includes(dirent.name)
        )
      : [];
  const files = content.filter(
    (dirent) =>
      !dirent.isDirectory() &&
      dirent.name.endsWith(".md") &&
      !ignFiles.includes(dirent.name)
  );
  return [
    ...files.map(({ name }) => ({
      text: pangu(path.basename(name, ".md")),
      link: `/${folderPath}/${path.basename(name, ".md")}`,
    })),
    ...folders.map((folder) => ({
      text: pangu(folder.name),
      items: generateSidebar(`${folderPath}/${folder.name}`, depth + 1),
      link: fs.existsSync(`${folderPath}/${folder.name}/index.md`)
        ? `/${folderPath}/${folder.name}/`
        : undefined,
    })),
  ].sort((a, b) => compareFileName(a.text, b.text));
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
