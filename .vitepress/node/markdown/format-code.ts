import { getNativeBinary } from 'clang-format'
import { exec, execFile } from 'node:child_process'
import { availableParallelism } from 'node:os'
import prettier from 'prettier'
import { CodeFenceProcessHook } from './codeblock-process.ts'

const prettierParsers = new Map([
  ['ts', 'typescript'],
  ['typescript', 'typescript'],
  ['js', 'babel'],
  ['javascript', 'babel'],
  ['css', 'css'],
  ['scss', 'scss'],
  ['less', 'less'],
  ['json', 'json'],
  ['json5', 'json5'],
  ['jsonc', 'jsonc'],
  ['markdown', 'markdown'],
  ['md', 'markdown'],
  ['html', 'html'],
  ['vue', 'vue'],
  ['angular', 'angular'],
  ['yaml', 'yaml'],
])
const clangLanguages = /^(?:c|c\+\+|cpp|cxx)\b/i
const clangStyle = '{BasedOnStyle: llvm, IndentWidth: 4, ColumnLimit: 75}'

function createClangFormatter() {
  // Skip the npm wrapper on supported platforms and use the PATH command elsewhere.
  let binary: string | undefined
  try {
    binary = getNativeBinary()
  } catch {}

  const concurrency = Math.min(availableParallelism(), 8)
  const waiting: (() => void)[] = []
  let active = 0

  return async (code: string): Promise<string> => {
    if (active < concurrency) active++
    else await new Promise<void>((resolve) => waiting.push(resolve))

    try {
      return await new Promise<string>((resolve, reject) => {
        const formatOptions = { encoding: 'utf8' } as const
        const done = (error: Error | null, stdout: string, stderr: string) => {
          if (stderr) process.stderr.write(stderr)
          if (error) reject(error)
          else resolve(stdout)
        }
        const child = binary
          ? execFile(binary, [`-style=${clangStyle}`], formatOptions, done)
          : exec(`clang-format -style="${clangStyle}"`, formatOptions, done)
        // The formatter may close stdin early when it fails.
        child.stdin!.on('error', () => {})
        child.stdin!.end(code)
      })
    } finally {
      const next = waiting.shift()
      if (next) next()
      else active--
    }
  }
}

const formatClang = createClangFormatter()

export const codeFormatProcessHook: CodeFenceProcessHook = (token) => {
  if (/:escape-format\b/.test(token.info)) return null
  const language = token.info.trim()
  const prettierParser = prettierParsers.get(language)
  const clangMatch = clangLanguages.test(language)
  if (!prettierParser && !clangMatch) return null

  return (async () => {
    try {
      if (prettierParser)
        token.content = await prettier.format(token.content, {
          parser: prettierParser,
          printWidth: 75,
        })
      else if (clangMatch) token.content = await formatClang(token.content)
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.warn('\nIllegal code: ' + String(error))
    }
  })()
}
