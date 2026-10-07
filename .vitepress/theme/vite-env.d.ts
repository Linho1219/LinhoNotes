/// <reference types="vite/client" />

declare module 'virtual:short-url-map' {
  type ShortUrlMap = Record<string, string>

  const maps: {
    legacy: ShortUrlMap
    current: ShortUrlMap
  }

  export default maps
}
