import fsp from "fs/promises";
import cheerio from "cheerio";

export default (filePath) => {
    const pathDirFiles = filePath.replace('.html', '_files')
  fsp
    .readFile(filePath, "utf-8")
    .then((resRead) => {
      const arrLink = [];
      const $ = cheerio.load(resRead);
      const items = $(
        '[content$=".png"], [content$=".jpg"], [href$=".png"], [href$=".jpg"], [src$=".png"], [src$=".jpg"]'
      );
      items.each((i, el) => {
        const src =
          $(el).attr("content") || $(el).attr("href") || $(el).attr("src");
        arrLink.push(src);
      });
      console.log(arrLink);
    })
    .catch((errRead) => {
      console.log("Error file reading", errRead);
    });
};
