import type { Plugin } from "vite";
import { exec } from "child_process";
import md5 from "blueimp-md5";

const getContributorsMd5 = async (filePath: string): Promise<string[]> =>
  new Promise((resolve, reject) => {
    const command = `git log --follow --pretty=format:"%ae\u200E%s" -- "${filePath}"`;
    exec(command, (error, stdout) => {
      if (error) return reject(error);
      // console.log(stdout);
      const contributors = Array.from(new Set(stdout.trim().split("\n")))
        .map((commit) => commit.split("\u200E"))
        .filter((commit) => !commit[1].startsWith("Merge branch"))
        .map((commit) => md5(commit[0]).substring(0, 10));
      resolve(contributors);
    });
  });

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
        const path = id.substring(rootDir.length);
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
