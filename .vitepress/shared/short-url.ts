import md5 from 'blueimp-md5'

export const LEGACY_SHORT_ID_LENGTH = 10
export const SHORT_ID_LENGTH = 8

const BASE36_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'
const BASE36_RADIX = BigInt(BASE36_ALPHABET.length)
const SHORT_ID_SPACE = BASE36_RADIX ** BigInt(SHORT_ID_LENGTH)

export function normalizePagePath(path: string) {
  return path.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
}

export function createLegacyShortId(path: string) {
  return md5(path).slice(0, LEGACY_SHORT_ID_LENGTH)
}

export function createShortId(path: string) {
  let value = BigInt(`0x${md5(path)}`) % SHORT_ID_SPACE
  let id = ''

  for (let i = 0; i < SHORT_ID_LENGTH; i++) {
    id = BASE36_ALPHABET[Number(value % BASE36_RADIX)] + id
    value /= BASE36_RADIX
  }

  return id
}

export function encodePagePath(path: string) {
  return path.split('/').map(encodeURIComponent).join('/')
}

export function createShareUrl(baseUrl: string, filePath: string) {
  const path = normalizePagePath(filePath)
  const base = baseUrl.replace(/\/$/, '')
  const directUrl = `${base}/${encodePagePath(path)}`
  const shortUrl = `${base}/${createShortId(path)}`

  return directUrl.length <= shortUrl.length ? directUrl : shortUrl
}
