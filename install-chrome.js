import {
  install,
  Browser,
  BrowserPlatform,
  resolveBuildId,
} from "@puppeteer/browsers";

import path from "node:path";
import { mkdirSync } from "node:fs";

const cacheDir = path.join(
  process.cwd(),
  ".cache",
  "puppeteer"
);

console.log("");
console.log("========================================");
console.log("Installing Puppeteer Chrome");
console.log("========================================");
console.log("Cache directory:");
console.log(cacheDir);

try {
  mkdirSync(cacheDir, {
    recursive: true,
  });

  const platform = BrowserPlatform.LINUX;

  const buildId = await resolveBuildId(
    Browser.CHROME,
    platform,
    "stable"
  );

  console.log("Chrome build:", buildId);
  console.log("Platform:", platform);
  console.log("");

  const result = await install({
    browser: Browser.CHROME,
    buildId,
    platform,
    cacheDir,
    downloadProgressCallback: "default",
    buildIdAlias: "stable",
  });

  console.log("");
  console.log("========================================");
  console.log("Puppeteer Chrome installed successfully");
  console.log("========================================");
  console.log(result);
  console.log("");
} catch (error) {
  console.error("");
  console.error("========================================");
  console.error("Puppeteer Chrome installation FAILED");
  console.error("========================================");
  console.error(error);
  console.error("");

  process.exit(1);
}