import { fileURLToPath } from "url";
import path from "path";
import downloadHtmlFile from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const pageLoader = (url, options) => {
  const hrefURL = new URL(url);
  const nameHtmlFile = `${hrefURL.host.replaceAll(
    ".",
    "-"
  )}${hrefURL.pathname.replaceAll("/", "-")}.html`;
  const filePath =
    (options.output || path.join(__dirname, "..", "/user/current-dir")) +
    "\\" +
    nameHtmlFile;
  return downloadHtmlFile(url, filePath);
};
