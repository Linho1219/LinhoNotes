import fs from "node:fs";
import path from "node:path";
import pangu from "pangu";
import json5 from "json5";
import pinyin from "pinyin";
import { DefaultTheme } from "vitepress";
import { sidebarConfig } from "../manualConfig";

const { ignProjects, ignDirs, ignFiles, maxDepth } = sidebarConfig;

interface DirConfig {
  pinned?: string[];
  bottomed?: string[];
  ignore?: string[];
  rewrites?: { [key: string]: string };
  collapseAllByDefault?: boolean;
}

const beautifyName = (name: string) =>
  pangu.spacingText(name.replaceAll("-", " ").replaceAll(/,(?=[^\s])/g, ", "));

const strIsRegExp = (str: string) => str.at(0) === "/" && str.at(-1) === "/";
const str2RegExp = (str: string) => new RegExp(str.slice(1, -1));
const test = (name: string) => (test: string) =>
  strIsRegExp(test) ? name.match(str2RegExp(test)) : name === test;
const rewriteName = (name: string, rewrites: Record<string, string>) => {
  const rewritesKeys = Object.keys(rewrites);
  for (const key of rewritesKeys)
    if (strIsRegExp(key)) {
      const reg = str2RegExp(key);
      if (name.match(reg))
        return pangu.spacingText(name.replace(reg, rewrites[key]));
    } else if (name === key) return pangu.spacingText(rewrites[key]);
  return beautifyName(name);
};

function compareFileName(a: string, b: string) {
  const numExp = /^(\d+)(\.(\d+))?-/;
  const [matchA, matchB] = [a, b].map((name) => name.match(numExp));
  if (!matchA || !matchB) return pinyin.compare(a, b);
  const [indexA, indexB] = [matchA, matchB].map((match) => ({
    big: Number(match[1]),
    small: Number(match[3] ?? 0),
  }));
  return (
    indexA.big - indexB.big ||
    indexA.small - indexB.small ||
    pinyin.compare(a, b)
  );
}

const sortDirent = (config: DirConfig) => (da: fs.Dirent, db: fs.Dirent) => {
  const { pinned = [], bottomed = [] } = config;
  const isPinned = (name: string) => Number(pinned.some(test(name)));
  const isBottomed = (name: string) => Number(bottomed.some(test(name)));
  const [a, b] = [da, db].map(({ name }) => isPinned(name) - isBottomed(name));
  return b - a || compareFileName(da.name, db.name);
};

function parseConfig(folderPath: string): DirConfig {
  const configPath = `${folderPath}/.sidebar.json5`;
  if (!fs.existsSync(configPath)) return {};
  try {
    const config = json5.parse(fs.readFileSync(configPath, "utf-8"));
    if (typeof config !== "object") {
      console.error(
        `\nError parsing ${configPath}: not an object.\nConfig ignored.\n`
      );
      return {};
    }
    return config;
  } catch (e) {
    console.error(`\nError parsing ${configPath}: ${e}\nConfig ignored.\n`);
    return {};
  }
}

const folderFilter = (config: DirConfig) => (dirent: fs.Dirent) =>
  dirent.isDirectory() &&
  !ignDirs.includes(dirent.name) &&
  !config.ignore?.some(test(dirent.name));

const fileFilter = (config: DirConfig) => (dirent: fs.Dirent) =>
  !dirent.isDirectory() &&
  dirent.name.endsWith(".md") &&
  !ignFiles.includes(dirent.name) &&
  !config.ignore?.some(test(dirent.name));

const mapItem =
  (folderPath: string, config: DirConfig, depth: number) =>
  (dirent: fs.Dirent): DefaultTheme.SidebarItem => {
    const { rewrites = {}, collapseAllByDefault } = config;
    const name = path.basename(dirent.name, ".md");
    const displayName = rewriteName(name, rewrites);
    if (dirent.isDirectory())
      return {
        text: displayName,
        items: generateSidebar(`${folderPath}/${name}`, depth + 1),
        link: fs.existsSync(`${folderPath}/${name}/index.md`)
          ? `/${folderPath}/${name}/`
          : undefined,
        collapsed: collapseAllByDefault ?? (depth === 0 ? false : true),
      };
    else
      return {
        text: displayName,
        link: `/${folderPath}/${name}`,
      };
  };

function generateSidebar(
  folderPath: string,
  depth = 0
): DefaultTheme.SidebarItem[] {
  if (!fs.existsSync(folderPath)) {
    console.error(`\nDirectory not found: ${folderPath}\n`);
    return [];
  }
  const content = fs.readdirSync(folderPath, { withFileTypes: true });
  const config = parseConfig(folderPath);

  const folders = depth >= maxDepth ? [] : content.filter(folderFilter(config));
  const files = content.filter(fileFilter(config));

  const sortAndMap = (dirents: fs.Dirent[]) =>
    dirents.sort(sortDirent(config)).map(mapItem(folderPath, config, depth));
  if (depth > 0) {
    return sortAndMap([...folders, ...files]);
  } else {
    return [
      { text: "简介：" + beautifyName(folderPath), link: `/${folderPath}/` },
      ...sortAndMap(folders),
      ...sortAndMap(files),
    ];
  }
}

export default function sidebar() {
  const sidebarObj: Record<string, DefaultTheme.SidebarItem[]> = {};
  fs.readdirSync("./", { withFileTypes: true })
    .filter((dir) => folderFilter({})(dir) && !ignProjects.includes(dir.name))
    .forEach(({ name }) => (sidebarObj[name] = generateSidebar(name)));
  return sidebarObj;
}
