import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const puppeteerCli = path.resolve(
  "node_modules/puppeteer/lib/esm/puppeteer/node/cli.js"
);

if (!existsSync(puppeteerCli)) {
  throw new Error(
    `Puppeteer CLI was not found at:\n${puppeteerCli}`
  );
}

console.log("Installing Puppeteer Chrome...");
console.log("Puppeteer CLI:", puppeteerCli);

execFileSync(
  process.execPath,
  [puppeteerCli, "browsers", "install", "chrome"],
  {
    stdio: "inherit",
  }
);

console.log("Puppeteer Chrome installation completed.");