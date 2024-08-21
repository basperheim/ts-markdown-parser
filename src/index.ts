import { parseMarkdown, elementToHtml, globalScript } from "./utils/markdown-parser";
import { parseMetadata } from "./utils/metadata-parser";

export const markdownToHtml = (markdown: string): string => {
  const elements = parseMarkdown(markdown);
  let html = elements.map(elementToHtml).join("");
  html += globalScript();
  return html;
};

export const getMarkdownMetadata = (markdown: string): Record<string, any> => {
  return parseMetadata(markdown);
};
