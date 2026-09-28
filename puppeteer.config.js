import path from "node:path";

export default {
  cacheDirectory: path.join(
    process.cwd(),
    ".cache",
    "puppeteer"
  ),
};