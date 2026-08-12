/**
 * 由于 Git 中的贡献者信息只包含 email 地址，因此需要通过 GitHub 获取贡献者的用户名。
 * 具体方法是通过 Git 获取作者及 Co-authored-by trailer 中的邮箱和一个相关 commit 的 sha1，
 * 再通过 GitHub GraphQL API 获取该 commit 的所有作者，从而将邮箱映射到 GitHub 用户名，
 * 最后通过用户名获取贡献者的详细信息（昵称、头像等）。
 * 贡献者的详细信息会被缓存以避免重复查询。
 * 详细信息会被添加到每个 .md 文件的 Frontmatter 中，格式为：<nickname>,<username>。
 * 头像会被下载到 public/avatars/<username>.png。
 * 完整介绍见 <https://notes.linho.cc/s?q=f23023157b>。
 */
import site from '#shared/site.json'
import { Octokit } from '@octokit/rest'
import axios from 'axios'
import 'dotenv/config'
import fs from 'fs'
import simpleGit from 'simple-git'
import type { Plugin } from 'vite'

const { owner, repo } = site.repo

const git = simpleGit()

const gitLogFormat =
  '--format=%H%x00%ae%x00%(trailers:key=Co-authored-by,valueonly,separator=%x00)%x1e'

/** 从 Git 处获取到的贡献者 email 及其一个相关 commit 的 sha1 */
type EmailWithSha1 = { email: string; sha1: string }
/** 贡献者 email 以及从 GitHub GraphQL API 处通过 sha1 查询到的用户名 */
type EmailWithUsername = { email: string; username: string }
/** 完整的贡献者信息 */
type FullContributorData = {
  username: string
  nickname: string
  avatar: string
  emails: string[]
}

/** 从 git log 输出中读取主作者和 Co-authored-by trailer 中的邮箱 */
function parseContributors(log: string): EmailWithSha1[] {
  const email2sha1 = new Map<string, string>()
  const commits = log
    .split('\x1e')
    .map((commit) => commit.trim())
    .filter(Boolean)
    .reverse()

  commits.forEach((commit) => {
    const [sha1, authorEmail, ...coAuthorTrailers] = commit.split('\x00')
    const coAuthorEmails = coAuthorTrailers
      .map((trailer) => trailer.match(/<([^<>]+)>\s*$/)?.[1])
      .filter((email): email is string => Boolean(email))

    for (const email of [authorEmail, ...coAuthorEmails]) {
      const normalizedEmail = email.trim().toLowerCase()
      if (normalizedEmail && !email2sha1.has(normalizedEmail)) {
        email2sha1.set(normalizedEmail, sha1)
      }
    }
  })

  return Array.from(email2sha1).map(([email, sha1]) => ({ email, sha1 }))
}

/** 获取仓库所有主作者及联合作者的 EmailWithSha1 */
async function getRepoContributors(): Promise<EmailWithSha1[]> {
  return parseContributors(await git.raw(['log', gitLogFormat]))
}

/** 获取指定文件的所有主作者及联合作者 email，排除自动生成的 Merge branch */
async function getEmailList(filePath: string): Promise<string[]> {
  return parseContributors(
    await git.raw(['log', gitLogFormat, '--follow', '--no-merges', '--', filePath]),
  ).map(({ email }) => email)
}

/**
 * 通过 GitHub GraphQL API 查询给定 EmailWithSha1 的用户名。
 * @param emailWithSha1
 * @param octokit GitHub Octokit 实例
 */
async function queryUsername(
  { email, sha1 }: EmailWithSha1,
  octokit: Octokit,
): Promise<EmailWithUsername> {
  type CommitAuthorsQuery = {
    repository: {
      object: {
        authors: {
          nodes: ({ email: string | null; user: { login: string } | null } | null)[] | null
        }
      } | null
    }
  }

  const result = await octokit.graphql<CommitAuthorsQuery>(
    `
      query ($owner: String!, $repo: String!, $oid: GitObjectID!) {
        repository(owner: $owner, name: $repo) {
          object(oid: $oid) {
            ... on Commit {
              authors(first: 100) {
                nodes {
                  email
                  user {
                    login
                  }
                }
              }
            }
          }
        }
      }
    `,
    { owner, repo, oid: sha1 },
  )
  const author = result.repository.object?.authors.nodes?.find(
    (candidate) => candidate?.email?.toLowerCase() === email,
  )
  if (!author?.user) throw new Error(`GitHub user not found for ${email} in commit ${sha1}`)
  return { email, username: author.user.login }
}

/**
 * 获取完整贡献者信息
 * @param emailWithUsername[]
 * @param octokit GitHub Octokit 实例
 */
function queryFullDataList(
  emailTuples: EmailWithUsername[],
  octokit: Octokit,
): Promise<FullContributorData[]> {
  const user2emails = new Map<string, string[]>() // username -> emails
  emailTuples.forEach(({ email, username }) => {
    if (user2emails.has(username)) user2emails.get(username)!.push(email)
    else user2emails.set(username, [email])
  })
  return Promise.all(
    Array.from(user2emails).map(([username, emails]) =>
      octokit.rest.users.getByUsername({ username }).then(({ data }) => ({
        username,
        nickname: data.name ?? username,
        avatar: data.avatar_url,
        emails,
      })),
    ),
  )
}

/** 下载头像 */
async function downloadImage(url: string, savePath: string) {
  const writer = fs.createWriteStream(savePath)
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  })
  response.data.pipe(writer)
  await new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

async function getContributorPlugin(): Promise<Plugin> {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  })
  const rawContributorList = await getRepoContributors()
  const emailWithUsername = await Promise.all(
    rawContributorList.map((usr) => queryUsername(usr, octokit)),
  )
  const fullUsrData = await queryFullDataList(emailWithUsername, octokit)

  fs.mkdirSync('./public/avatars', { recursive: true })
  await Promise.all(
    fullUsrData.map(({ username, avatar }) =>
      downloadImage(avatar, `./public/avatars/${username}.png`),
    ),
  )

  return {
    name: 'add-contributors',
    enforce: 'pre',
    async transform(code, path) {
      if (!path.endsWith('.md') || code.trim().match(/^---\r?\n/) !== null) return // 若 Frontmatter 存在则跳过
      const nameTuples = (await getEmailList(path))
        .map((e) => fullUsrData.find(({ emails }) => emails.includes(e))!)
        .map(({ nickname, username }) => `${nickname},${username}`)
      const finalList = Array.from(new Set(nameTuples)).join(';')
      return `---\ncontributorList: ${finalList}\n---\n\n` + code
    },
  }
}

export default getContributorPlugin
