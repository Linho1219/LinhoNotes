import fs from "fs";
import axios from "axios";
import { fullContributorList } from "./util";

async function downloadImage(url: string, savePath: string) {
  const writer = fs.createWriteStream(savePath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    },
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

export default async function mirrorAvartar() {
  let cnt = 0;
  return new Promise((resolve) => {
    for (const { username } of fullContributorList) {
      // console.log(username);
      fs.mkdirSync("./public/avartars", { recursive: true });
      cnt++;
      downloadImage(
        `https://github.com/${username}.png`,
        `./public/avartars/${username}.png`
      )
        .then(
          () => {
            console.log(`${username}.png downloaded successfully`);
            cnt--;
          },
          (err) => {
            console.error(`Error downloading ${username}.png: ${err}`);
            cnt--;
          }
        )
        .finally(() => {
          if (cnt === 0) resolve(null);
        });
    }
  });
}
