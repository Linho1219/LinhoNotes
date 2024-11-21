import "dotenv/config";

import type { Plugin } from "vite";
import { exec } from "child_process";
import fs from "fs";
import axios from "axios";
import simpleGit from "simple-git";
import { Octokit } from "@octokit/rest";
import { globalConfig } from "../manualConfig";
const { owner, repo } = globalConfig;

const git = simpleGit();

async function getRepoContributors(): Promise<
  Array<{ email: string; sha1: string }>
> {
  const log = (await git.log(["--format=%H %ae"])).latest?.hash
    .split("\n")
    .reverse();
  const contributors = new Map();
  if (!log) throw new Error("Uexpected log");
  log.forEach((commit) => {
    const [sha, email] = commit.split(" ");
    if (!contributors.has(email)) {
      contributors.set(email, sha);
    }
  });
  return Array.from(contributors).map(([email, sha1]) => ({ email, sha1 }));
}

const getEmailList = async (filePath: string): Promise<string[]> =>
  new Promise((resolve) => {
    const command = `git log --follow --pretty=format:"%ae\u200E%s" -- "${filePath}"`; // 输出邮箱和标题，跟踪重命名
    exec(command, (error, stdout) => {
      if (error) {
        console.error(error);
        return resolve([]);
      }
      resolve(
        Array.from(
          new Set(
            stdout
              .trim()
              .split("\n")
              .map((rawline) => rawline.split("\u200E"))
              .filter((commit) => !commit[1]?.startsWith("Merge branch"))
              .map(([email]) => email)
          )
        )
      );
    });
  });

async function queryUserName(
  { email, sha1 },
  octokit: Octokit
): Promise<[string, string]> {
  const authorQuery = (
    await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref: sha1,
    })
  ).data?.author;
  if (!authorQuery) throw new Error("Author not found");
  return [email, authorQuery.login];
}

async function queryFullContributorData(
  emailTuple: [string, string][],
  octokit: Octokit
) {
  const list: Array<{ username: string; emails: string[] }> = [];
  emailTuple.forEach(([email, username]) => {
    const listMatch = list.find(
      (contributor) => contributor.username === username
    );
    if (listMatch) listMatch.emails.push(email);
    else
      list.push({
        username,
        emails: [email],
      });
  });
  return await Promise.all(
    list.map(async ({ username, emails }) => {
      const { data } = await octokit.rest.users.getByUsername({ username });
      return {
        username,
        nickname: data.name ?? username,
        avatar: data.avatar_url,
        emails,
      };
    })
  );
}

async function downloadImage(url: string, savePath: string) {
  const writer = fs.createWriteStream(savePath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

/** 在每个 .md 文件的 Frontmatter 中加上贡献者信息。若 Frontmatter 存在则跳过。 */
const addContributors = (async (): Promise<Plugin> => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  const rawContributorList = await getRepoContributors();
  const emailTuples = await Promise.all(
    rawContributorList.map((contributor) => queryUserName(contributor, octokit))
  );
  const contributorsCache = await queryFullContributorData(
    emailTuples,
    octokit
  );
  fs.mkdirSync("./public/avatars", { recursive: true });
  try {
    await Promise.all(
      contributorsCache.map(({ username, avatar }) =>
        downloadImage(avatar, `./public/avatars/${username}.png`)
      )
    );
  } catch (e) {
    console.error("Avatar download failed");
  }
  return {
    name: "add-contributors",
    enforce: "pre",
    async transform(code, path) {
      if (!path.endsWith(".md") || code.trim().match(/^---\r?\n/) !== null)
        return;
      const emailList = await getEmailList(path);
      const fullList = emailList.map(
        (email) =>
          contributorsCache.find(({ emails }) => emails.includes(email))!
      );
      return (
        `---\ncontributorList: ${Array.from(
          new Set(
            fullList.map(({ nickname, username }) => `${nickname},${username}`)
          )
        ).join(";")}\n---\n\n` + code
      );
    },
  };
})();

export default addContributors;
