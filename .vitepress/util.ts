export const pangu = (str: string) =>
  str
    .replace(/([0-9A-Za-z&+\-])([\u4e00-\u9fff])/g, "$1 $2")
    .replace(/([\u4e00-\u9fff])([0-9A-Za-z&+\-])/g, "$1 $2");

export const baseUrl = "https://notes.linho.cc";

type Contributor = {
  username: string;
  emailHash: string[];
};

export const contributors: Contributor[] = [
  {
    username: "Linho",
    emailHash: ["81c7445a52", "0c5b28c9ad"],
  },
  {
    username: "Horrible120",
    emailHash: ["fcf0370694"],
  },
  {
    username: "SkinCrab",
    emailHash: ["7368906deb"],
  },
  {
    username: "acha666",
    emailHash: ["d772a76fa1"],
  },
  {
    username: "CindyFang0716",
    emailHash: ["2e08b8e801"],
  },
];
