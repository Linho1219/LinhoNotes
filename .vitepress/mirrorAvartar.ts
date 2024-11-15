import fs from "fs";
import axios from "axios";
import { fullContributorList } from "./util";

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

export default function mirrorAvartar() {
  for (const { username } of fullContributorList) {
    console.log(username);
    fs.mkdirSync("./public/avartars", { recursive: true });
    downloadImage(
      `https://github.com/${username}.png`,
      `./public/avartars/${username}.png`
    ).then(
      () => console.log(`${username}.png downloaded successfully`),
      (err) => console.error(`Error downloading ${username}.png: ${err}`)
    );
  }
}
