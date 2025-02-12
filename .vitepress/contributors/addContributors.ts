/**
 * 由于 Git 中的贡献者信息只包含 email 地址，因此需要通过 GitHub 获取贡献者的用户名。
 * 具体方法是通过 Git 获取该贡献者一个 commit 的 sha1，通过 GitHub API 获取该 commit 的详细信息，
 * 从而获取到贡献者的用户名，再通过用户名获取贡献者的详细信息（昵称、头像等）。
 * 贡献者的详细信息会被缓存以避免重复查询。
 * 详细信息会被添加到每个 .md 文件的 Frontmatter 中，格式为：<nickname>,<username>。
 * 头像会被下载到 public/avatars/<username>.png。
 */

import "dotenv/config";

import type { Plugin } from "vite";
import fs from "fs";
import axios from "axios";
import simpleGit from "simple-git";
import { Octokit } from "@octokit/rest";
import { globalConfig } from "../manualConfig";
const { owner, repo } = globalConfig;

const git = simpleGit();

/** 从 Git 处获取到的贡献者 email 及其一个 commit 的 sha1 */
type EmailWithSha1 = { email: string; sha1: string };
/** 贡献者 email 以及从 GitHub API 处通过 sha1 查询到的用户名 */
type EmailWithUsername = { email: string; username: string };
/** 完整的贡献者信息 */
type FullContributorData = {
  username: string;
  nickname: string;
  avatar: string;
  emails: string[];
};

/** 获取仓库所有贡献者的 EmailWithSha1 */
async function getRepoContributors(): Promise<EmailWithSha1[]> {
  const log = (await git.log(["--format=%H %ae"])).latest?.hash
    .split("\n")
    .reverse();
  const contributors = new Map();
  if (!log) throw new Error("Unexpected log");
  log.forEach((commit) => {
    const [sha, email] = commit.split(" ");
    if (!contributors.has(email)) {
      contributors.set(email, sha);
    }
  });
  return Array.from(contributors).map(([email, sha1]) => ({ email, sha1 }));
}

/** 获取指定文件的所有贡献者的 email，排除自动生成的 Merge branch */
async function getEmailList(filePath: string): Promise<string[]> {
  const log = (
    await git.log(["--follow", "--format=%ae", "--no-merges", filePath])
  ).latest?.hash
    .split("\n")
    .reverse();
  if (!log) throw new Error("Unexpected log");
  return Array.from(new Set(log));
}

/**
 * 通过 GitHub API 查询给定 EmailWithSha1 的用户名。
 * @param emailWithSha1
 * @param octokit GitHub Octokit 实例
 */
async function queryUsername(
  { email, sha1 }: EmailWithSha1,
  octokit: Octokit
): Promise<EmailWithUsername> {
  const authorQuery = (
    await octokit.rest.repos.getCommit({ owner, repo, ref: sha1 })
  ).data?.author;
  if (!authorQuery) throw new Error("Author not found");
  return { email, username: authorQuery.login };
}

/**
 * 获取完整贡献者信息
 * @param emailWithUsername
 * @param octokit GitHub Octokit 实例
 */
function queryFullUsrData(
  emailTuples: EmailWithUsername[],
  octokit: Octokit
): Promise<FullContributorData[]> {
  const list: Array<{ username: string; emails: string[] }> = [];

  emailTuples.forEach(({ email, username }) => {
    const listMatch = list.find(({ username: u }) => u === username);
    if (listMatch) listMatch.emails.push(email);
    else list.push({ username, emails: [email] });
  });

  return Promise.all(
    list.map(({ username, emails }) =>
      octokit.rest.users.getByUsername({ username }).then(({ data }) => ({
        username,
        nickname: data.name ?? username,
        avatar: data.avatar_url,
        emails,
      }))
    )
  );
}

/** 下载头像 */
async function downloadImage(url: string, savePath: string) {
  const writer = fs.createWriteStream(savePath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);
  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function getContributorPlugin(): Promise<Plugin> {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  const rawContributorList = await getRepoContributors();
  const emailWithUsername = await Promise.all(
    rawContributorList.map((usr) => queryUsername(usr, octokit))
  );
  const fullUsrData = await queryFullUsrData(emailWithUsername, octokit);

  if (process.env.NODE_ENV === "production") {
    fs.mkdirSync("./public/avatars", { recursive: true });
    try {
      await Promise.all(
        fullUsrData.map(({ username, avatar }) =>
          downloadImage(avatar, `./public/avatars/${username}.png`)
        )
      );
    } catch (e) {
      console.error("\nAvatar download failed\n");
    }
  }
  return {
    name: "add-contributors",
    enforce: "pre",
    async transform(code, path) {
      if (!path.endsWith(".md") || code.trim().match(/^---\r?\n/) !== null)
        return; // 若 Frontmatter 存在则跳过
      const nameTuples = (await getEmailList(path))
        .map((em) => fullUsrData.find(({ emails }) => emails.includes(em))!)
        .map(({ nickname, username }) => `${nickname},${username}`);
      const finalList = Array.from(new Set(nameTuples)).join(";");
      return `---\ncontributorList: ${finalList}\n---\n\n` + code;
    },
  };
}

export default getContributorPlugin;
