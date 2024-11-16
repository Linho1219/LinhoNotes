export const pangu = (str: string) =>
  str
    .replace(/([0-9A-Za-z&+\-])([\u4e00-\u9fff])/g, "$1 $2")
    .replace(/([\u4e00-\u9fff])([0-9A-Za-z&+\-])/g, "$1 $2");

export const baseUrl = "https://notes.linho.cc";

export type Contributor = {
  nickname: string;
  username: string;
  emailHash: string[];
};

export const fullContributorList: Contributor[] = [
  {
    nickname: "Linho",
    username: "Linho1219",
    emailHash: ["81c7445a52", "0c5b28c9ad"],
  },
  {
    nickname: "Horrible",
    username: "Horrible120",
    emailHash: ["fcf0370694", "f408246931"],
  },
  {
    nickname: "GBY.",
    username: "SkinCrab",
    emailHash: ["7368906deb"],
  },
  {
    nickname: "Acha",
    username: "acha666",
    emailHash: ["d772a76fa1", "15e5ea97d8"],
  },
  {
    nickname: "Cindy Fang",
    username: "CindyFang0716",
    emailHash: ["2e08b8e801"],
  },
  {
    nickname: "Su-Zi-Zhan",
    username: "Su-Zi-Zhan",
    emailHash: ["18c6a8f3f6"],
  },
];
