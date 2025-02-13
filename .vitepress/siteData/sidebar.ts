import fs from "fs";
import path from "path";
import pinyin from "pinyin";
import { DefaultTheme } from "vitepress";
import pangu from "pangu";
import { sidebarConfig } from "../manualConfig";

const { ignProjects, ignDirs, ignFiles, maxDepth } = sidebarConfig;

function compareFileName(a: string, b: string) {
  const extractNum = /^((\d+)(\.(\d+))?)\s/;
  const matchA = a.match(extractNum),
    matchB = b.match(extractNum);
  if (!matchA || !matchB) return pinyin.compare(a, b);
  const NumberWithoutNaN = (str: string) =>
    isNaN(Number(str)) ? 0 : Number(str);
  const indexA = Number(matchA[2]) * 1000 + NumberWithoutNaN(matchA[4]),
    indexB = Number(matchB[2]) * 1000 + NumberWithoutNaN(matchB[4]);
  return indexA - indexB;
}
const compareItem = (
  { text: a }: DefaultTheme.SidebarItem,
  { text: b }: DefaultTheme.SidebarItem
) => compareFileName(a!, b!);

const beautifyName = (name: string) =>
  pangu.spacing(name.replaceAll("-", " ").replaceAll(/,(?=[^\s])/g, ", "));

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
      text: beautifyName(folder.name),
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
      text: beautifyName(path.basename(name, ".md")),
      link: `/${folderPath}/${path.basename(name, ".md")}`,
    }));

  if (depth === 0) {
    return [
      { text: "简介：" + beautifyName(folderPath), link: `/${folderPath}/` },
      ...folders.sort(compareItem),
      ...files.sort(compareItem),
    ];
  } else return [...folders, ...files].sort(compareItem);
}

export default function sidebar() {
  const sidebarObj = {};
  fs.readdirSync("./", { withFileTypes: true })
    .filter((dir) => dir.isDirectory() && !ignProjects.includes(dir.name))
    .forEach(({ name }) => (sidebarObj[name] = generateSidebar(name)));
  return sidebarObj;
}
