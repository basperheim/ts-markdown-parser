import { performance } from "perf_hooks";
import { readFileSync } from "fs";
import { join } from "path";
import { markdownToHtml as localMarkdownToHtml } from "./dist/index.js"; // Use built code!

const markdownFilePath = join(__dirname, "notes/example-html-blog-partial.md");
const markdown = readFileSync(markdownFilePath, "utf8");

const opts = { addCopyToClipboard: true, interactiveCheckboxes: false };

const runAndTime = (label: string, fn: () => string): number => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${label} took ${(end - start).toFixed(2)}ms`);
  return end - start;
};

(async () => {
  // Test your freshly built code
  const localTime = runAndTime("Local (dist) version", () => localMarkdownToHtml(markdown, opts));

  // Published version
  const published = await import("./test_versions/v1_4_2/node_modules/ts-markdown-parser/dist/index.js");
  const publishedTime = runAndTime("Published v1.4.2", () => published.markdownToHtml(markdown, true));

  console.log("\n--- Summary ---");
  console.log(`Local (dist):       ${localTime.toFixed(2)}ms`);
  console.log(`Published v1.4.2:   ${publishedTime.toFixed(2)}ms`);
})();
