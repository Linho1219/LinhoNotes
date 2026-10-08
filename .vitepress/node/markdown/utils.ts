export const encodeHtmlAttr = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
