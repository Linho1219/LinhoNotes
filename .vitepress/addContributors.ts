import type { Plugin } from "vite";
import { exec } from "child_process";
import md5 from "blueimp-md5";

/**
 * 通过 Git 获取文件的贡献者列表，输出贡献者邮箱的 MD5 的前 10 位。
 * 跟踪重命名。不包含 Merge branch 引起的更改。
 * @param filePath 需查询的文件路径
 */
const getContributorsMd5 = async (filePath: string): Promise<string[]> =>
  new Promise((resolve) => {
    const command = `git log --follow --pretty=format:"%ae\u200E%s" -- "${filePath}"`;
    exec(command, (error, stdout) => {
      if (error) {
        console.error(error);
        return resolve([]);
      }
      // console.log(stdout);
      try {
        const contributors = Array.from(new Set(stdout.trim().split("\n")))
          .map((commit) => commit.split("\u200E"))
          .filter((commit) => !commit[1]?.startsWith("Merge branch"))
          .map((commit) => md5(commit[0]).substring(0, 10));
        resolve(contributors);
      } catch (e) {
        console.error(e);
        resolve([]);
      }
    });
  });

/** 在每个 .md 文件的 Frontmatter 中加上贡献者信息。若 Frontmatter 存在则跳过。 */
const addContributors = ((): Plugin => {
  let rootDir = "";
  return {
    name: "add-contributors",
    enforce: "pre",
    configResolved(resolvedConfig) {
      rootDir = resolvedConfig.root;
    },
    async transform(code, id) {
      if (id.endsWith(".md") && code.trim().match(/^---\r?\n/) === null) {
        // const path = id.substring(rootDir.length);
        return (
          `---\ncontributorList: ${(
            await getContributorsMd5(id)
          ).join()}\n---\n\n` + code
        );
      }
    },
  };
})();

export default addContributors;
