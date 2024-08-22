import { parseMarkdown, elementToHtml, globalScript } from "./utils/markdown-parser";
import { parseMetadata } from "./utils/metadata-parser";

/**
 * Converts a Markdown string into an HTML string.
 *
 * This function parses the Markdown content to generate HTML and appends a global script.
 *
 * @param {string} markdown - The Markdown content to be converted to HTML.
 * @returns {string} The resulting HTML content.
 *
 * @example
 * const markdown = "# Hello World\nThis is a test.";
 * const html = markdownToHtml(markdown);
 * console.log(html); // Outputs the HTML representation of the Markdown
 */
export const markdownToHtml = (markdown: string): string => {
  const elements = parseMarkdown(markdown);
  let html = elements.map(elementToHtml).join("");
  html += globalScript();
  return html;
};

/**
 * Extracts metadata from a Markdown string.
 *
 * This function extracts and parses the YAML front matter from the Markdown content,
 * returning it as a JavaScript object.
 *
 * @param {string} markdown - The Markdown content from which to extract metadata.
 * @returns {Record<string, any>} An object containing the metadata extracted from the Markdown.
 *
 * @example
 * const markdown = `
 * ---
 * title: "Example Article"
 * author: "Author Name"
 * date: "2024-08-21"
 * ---
 * # Hello World
 * This is a test.
 * `;
 * const metadata = getMarkdownMetadata(markdown);
 * console.log(metadata); // Outputs the metadata object
 */
export const getMarkdownMetadata = (markdown: string): Record<string, any> => {
  return parseMetadata(markdown);
};
