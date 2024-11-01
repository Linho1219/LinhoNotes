export const pangu = (str: string) =>
  str
    .replace(/([0-9A-Za-z&+\-])([\u4e00-\u9fff])/g, "$1 $2")
    .replace(/([\u4e00-\u9fff])([0-9A-Za-z&+\-])/g, "$1 $2");

export const baseUrl = "https://notes.linho.cc";
