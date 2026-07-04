import type MarkdownIt from 'markdown-it'

export default function mdImageViewer(md: MarkdownIt) {
  const origImageRule = md.renderer.rules.image!
  const origHtmlBlockRule = md.renderer.rules.html_block!
  const origHtmlInlineRule = md.renderer.rules.html_inline!
  function putErr(str: string) {
    if (process.env.NODE_ENV === 'production') throw new Error(str)
    console.error(str)
  }

  md.renderer.rules.image = (tokens, idx, options, env, slf) => {
    if (tokens[idx].attrs)
      tokens[idx].attrs.forEach(([attr, value]) => {
        if (attr !== 'src') return
        value = decodeURI(value)
        if (value.match(/[A-Za-z]:\\/))
          putErr(`Bad image URI: Use relative path instead\n  Src: ${value}`)
        if (value.includes('\\'))
          putErr(`Bad image URI: Please use "/" instead of "\\"\n  Src:${value}`)
      })
    tokens[idx].attrSet('data-image-viewer', 'image')

    const isInline = tokens[idx - 1]?.type === 'text' || tokens[idx + 1]?.type === 'text'
    tokens[idx].attrSet('data-image-type', isInline ? 'inline' : 'block')
    return origImageRule(tokens, idx, options, env, slf)
  }

  const htmlImgRule =
    (inline: boolean): typeof origHtmlBlockRule =>
    (tokens, idx, options, env, slf) => {
      const origRule = inline ? origHtmlInlineRule : origHtmlBlockRule
      const rendered = origRule(tokens, idx, options, env, slf).trim()
      if (!/^<img[^>]*\/>$/.test(rendered)) return rendered
      const tagged = rendered.replace(
        /^<img/,
        `<img data-image-viewer="image" data-image-type="${inline ? 'inline' : 'block'}"`,
      )
      if (inline) return tagged
      else return `<p>${tagged}</p>`
    }

  md.renderer.rules.html_block = htmlImgRule(false)
  md.renderer.rules.html_inline = htmlImgRule(true)
}
