import { markdownToHtml } from "./src/index";

const markdown = `
# Sample Heading
\`\`\`javascript
console.log("Hello, world!");
\`\`\`

## Subheading

Some text.
`;

console.log(markdownToHtml(markdown));

// npx ts-node test.ts
