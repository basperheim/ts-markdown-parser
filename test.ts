import { markdownToHtml } from "./src/index";
import { writeFileSync, truncateSync, readFileSync } from "fs";
import { join } from "path";

// Define the paths for the Markdown file and the HTML output file
// const markdownFilePath = join(__dirname, "notes/example-html-blog-partial.md");
// const markdownFilePath = join(__dirname, "notes/example-markdown-blog-post.md");
// const markdownFilePath = join(__dirname, "notes/example-js-blog.md");
const markdownFilePath = join(__dirname, "notes/regex-in-python.md");
// const markdownFilePath = join(__dirname, "notes/example-py-blog.md");

const htmlFilePath = join(__dirname, "test.html");

// Read the Markdown file
let markdown: string;
try {
  markdown = readFileSync(markdownFilePath, "utf8");
} catch (error) {
  console.error("Error reading Markdown file:", error);
  process.exit(1); // Exit the process with an error code
}

// Convert Markdown to HTML
const htmlContent = markdownToHtml(markdown);

// Basic HTML template
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Test</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 20px;
    line-height: 1.6;
    color: #333;
    background-color: #f9f9f9;
  }

  img {
    max-width: 3rem;
  }

  h1, h2, h3, h4 {
    color: #444;
    margin-bottom: 15px;
    border-bottom: 2px solid #ddd;
    padding-bottom: 5px;
  }

  h1 { font-size: 2em; }
  h2 { font-size: 1.75em; }
  h3 { font-size: 1.5em; }
  h4 { font-size: 1.25em; }

  p {
    margin: 15px 0;
  }

  ul, ol {
    margin: 15px 0;
    padding-left: 40px;
  }

  li {
    margin-bottom: 10px;
  }

  .md-inline-code {
    background: #eaeaea;
    color: #d63384;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9em;
  }

  pre {
    background: #2d2d2d;
    padding: 15px;
    border-radius: 8px;
    color: #f8f8f2;
    overflow-x: auto;
    font-size: 0.9em;
  }

  .md-code {
    background: #2d2d2d;
    color: #f8f8f2;
    padding: 5px 8px;
    border-radius: 4px;
    display: block;
    white-space: pre-wrap;
    font-family: 'Courier New', Courier, monospace;
  }

  .md-code-container {
    margin-bottom: 20px;
    position: relative;
  }

  .md-code-container button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #5a5a5a;
    color: #f8f8f2;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.85em;
  }

  .md-code-container button:hover {
    background-color: #444;
  }

  /* Syntax highlighting */
  .md-keyword { color: #66d9ef; font-weight: bold; }
  .md-string { color: #a6e22e; }
  .md-number { color: #ae81ff; }
  .md-comment { color: #909090; font-style: italic; }
  .md-special { color: #FF69B4; font-style: bold; }
  .md-class { color: #39FF14; font-style: bold; }
  .md-decorator { color: magenta; font-style: normal; }
  .md-regex { color: red; font-style: normal; }
  .md-call-method { color: yellow; font-style: bold; }
</style>
</head>
<body>
  ${htmlContent}
</body>
</html>
`;

// Truncate the file if it already exists
try {
  truncateSync(htmlFilePath);
} catch (error) {
  console.error("Error truncating file:", error);
}

// Write the HTML content to the file
try {
  writeFileSync(htmlFilePath, htmlTemplate, "utf8");
  // console.log("\nresult =>");
  // console.log(htmlTemplate);
  // console.log(`\nHTML written to ${htmlFilePath}`);
} catch (error) {
  console.error("Error writing to file:", error);
}
