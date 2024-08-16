import { markdownToHtml } from "./src/index";
import { writeFileSync, truncateSync } from "fs";
import { join } from "path";

// Define the path for the HTML file
const filePath = join(__dirname, "test.html");

// Markdown content for testing
const markdown = `
# Sample Heading
\`\`\`javascript
console.log("Hello, world!");
const test = "<span>hello again</span>";
console.log(test);
\`\`\`

## Subheading

Some text.
`;

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
    /* Add any CSS styling you need here */
    body { font-family: Arial, sans-serif; margin: 20px; }
    code { background: #f4f4f4; padding: 2px 4px; border-radius: 4px; }
    .keyword { color: blue; }
    /* Add more styling rules as needed */
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
`;

// Truncate the file if it already exists
try {
  truncateSync(filePath);
} catch (error) {
  console.error("Error truncating file:", error);
}

// Write the HTML content to the file
try {
  writeFileSync(filePath, htmlTemplate, "utf8");
  console.log("\nresult =>");
  console.log(htmlTemplate);
  console.log(`\nHTML written to ${filePath}`);
} catch (error) {
  console.error("Error writing to file:", error);
}
