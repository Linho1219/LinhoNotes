import fs from "fs";
import path from "path";
import { DefaultTheme } from "vitepress";
import pangu from "pangu";
import { sidebarConfig } from "../manualConfig";

const { ignProjects, ignDirs, ignFiles, maxDepth } = sidebarConfig;

function compareFileName(a: string, b: string) {
  const extractNum = /^((\d+)(\.(\d+))?)\s/;
  const matchA = a.match(extractNum),
    matchB = b.match(extractNum);
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

  const folders: DefaultTheme.SidebarItem[] = (depth < maxDepth ? content : [])
    .filter((dirent) => dirent.isDirectory() && !ignDirs.includes(dirent.name))
    .map((folder) => ({
      text: pangu.spacing(folder.name.replaceAll("-", " ")),
      items: generateSidebar(`${folderPath}/${folder.name}`, depth + 1),
      link: fs.existsSync(`${folderPath}/${folder.name}/index.md`)
        ? `/${folderPath}/${folder.name}/`
        : undefined,
      collapsed: depth === 0 ? false : true,
    }));

  const files: DefaultTheme.SidebarItem[] = content
    .filter(
      (dirent) =>
        !dirent.isDirectory() &&
        dirent.name.endsWith(".md") &&
        !ignFiles.includes(dirent.name)
    )
    .map(({ name }) => ({
      text: pangu.spacing(path.basename(name, ".md").replaceAll("-", " ")),
      link: `/${folderPath}/${path.basename(name, ".md")}`,
    }));

  if (depth === 0) {
    return [
      {
        text: "简介：" + pangu.spacing(folderPath.replaceAll("-", " ")),
        link: `/${folderPath}/`,
      },
      ...folders.sort((a, b) => compareFileName(a.text!, b.text!)),
      ...files.sort((a, b) => compareFileName(a.text!, b.text!)),
    ];
  } else
    return [...folders, ...files].sort((a, b) =>
      compareFileName(a.text!, b.text!)
    );
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
