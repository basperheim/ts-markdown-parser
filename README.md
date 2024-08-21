# ts-markdown-parser

`ts-markdown-parser` is a TypeScript-based library for converting Markdown to HTML with built-in syntax highlighting for various programming languages. Currently, it supports HTML, JavaScript, TypeScript, and Python code highlighting, with plans to expand to more languages in the future.

## Installation

To install the package, run:

```bash
npm install ts-markdown-parser
```

## Usage

Here's a basic example of how to use `ts-markdown-parser` to convert Markdown to HTML:

```javascript
const { markdownToHtml } = require("ts-markdown-parser");

// Your Markdown content
const markdown = `
# Sample Heading

\`\`\`javascript
console.log("Hello, world!");
\`\`\`

## Subheading

Some text.

![Alt text](https://example.com/image.png)

[Link text](https://example.com)
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

// Output HTML to a file or use as needed
```

### TypeScript Usage

Here's how you might use it in your TypeScript code:

```ts
import * as fs from "fs";
import { markdownToHtml, getMarkdownMetadata } from "ts-markdown-parser";
// ...
const file = "/path/to/my-markdown.md";
const markdownString = fs.readFileSync(file, "utf8");
const htmlString: string | undefined = markdownToHtml(markdownString);

if (!htmlString) {
  console.error(`Failed to generate HTML from: ${file}.`);
}

const metadata: Record<string, any> = getMarkdownMetadata(markdownString);
if (!metadata?.title) {
  console.error(`Markdown file '${file}' is missing metadata.`);
}
```

## Metadata Parsing

You can also extract metadata from your Markdown files using YAML front matter.

Here's how to use the `getMarkdownMetadata()` function:

```javascript
const { getMarkdownMetadata } = require("ts-markdown-parser");

// Your Markdown content with YAML front matter
const markdown = `
---
title: "Example Markdown Article for HTML"
author: "ChatGPT"
date: 2024-08-19
keywords: scripting, html, web development, markdown, blog
slug: markdown-article-test-for-html
---

# Sample Heading

Some text.
`;

// Extract metadata
const metadata = getMarkdownMetadata(markdown);

console.log(metadata);
```

The metadata object literal response should look something like this:

```js
{
  title: 'Example Markdown Article for HTML',
  author: 'ChatGPT',
  date: '2024-08-19', // Date formatted as string
  keywords: [ 'scripting', 'html', 'web development', 'markdown', 'blog' ],
  slug: 'markdown-article-test-for-html'
}
```

### Example YAML Front Matter

YAML front matter is a way to include metadata at the top of your Markdown files. Here's another example:

```yaml
---
title: "Example Markdown Article for HTML"
author: "ChatGPT"
date: 2024-08-19
id: "1234"
keywords: scripting, html, web development, markdown, blog
slug: markdown-article-test-for-html
---
```

### Metadata Extraction Result

Given the YAML front matter above, `getMarkdownMetadata` would return:

```json
{
  "title": "Example Markdown Article for HTML",
  "author": "ChatGPT",
  "date": "2024-08-19", // Date formatted as string
  "id": 1234, // String representation of number parsed and casted as number
  "keywords": ["scripting", "html", "web development", "markdown", "blog"],
  "slug": "markdown-article-test-for-html"
}
```

## Features

- **Markdown Elements Supported:**

  - Headers (1-5)
  - Ordered and unordered lists
  - Bold and italic text
  - Inline code and code blocks
  - Images (`![Alt text](url)`)
  - Links (`[Link text](url)`)

- **Code Highlighting Supported For:**

  - HTML
  - JavaScript
  - TypeScript
  - Python

- **Metadata Parsing:**

  - Extract metadata from YAML front matter.
  - Handles title, author, date, keywords, slug, and more.

- **Note:** Table/grid support is not yet available.

## Screenshots

When you properly apply styles to the generated `md-*` CSS classes, the final HTML should look something like this:

![Python Markdown-to-HTML Example](https://github.com/user-attachments/assets/d1989dd6-1348-4eb2-85be-a34578fe8a5d)

![Markdown Sample Markdown-to-HTML with Image](https://github.com/user-attachments/assets/b17f8d23-eede-47e9-96ab-54b322e428f3)

![HTML Code Block Markdown-to-HTML Example](https://github.com/user-attachments/assets/cdc3df63-b722-427c-ba1e-2cb16ca12489)

## Contributing

We welcome suggestions and feedback, but all code contributions require prior permission. Please submit issues or feature requests, and if you would like to contribute code, contact the repository owner for permission.

## License

This project is licensed under the MIT License. Feel free to use the code in your own projects or fork it, but contributions to the repository are managed by the project owner and require permission.
