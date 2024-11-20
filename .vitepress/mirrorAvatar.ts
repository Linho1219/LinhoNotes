import fs from "fs";
import axios from "axios";
import { fullContributorList } from "./manualConfig";

async function downloadImage(url: string, savePath: string) {
  const writer = fs.createWriteStream(savePath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

/** 将贡献者的头像存入 `./public/avatars`，打包进网站 */
export default async function mirrorAvatar() {
  let cnt = fullContributorList.length;
  return new Promise((resolve) => {
    for (const { username } of fullContributorList) {
      fs.mkdirSync("./public/avatars", { recursive: true });
      downloadImage(
        `https://github.com/${username}.png`,
        `./public/avatars/${username}.png`
      )
        .then(
          () => console.log(`${username}.png downloaded successfully`),
          (err) => console.error(`${username}.png failed:\n  ${err}`)
        )
        .finally(() => (--cnt ? resolve(null) : null));
    }
  });
}