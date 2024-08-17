import { parseMarkdown, elementToHtml, globalScript } from "./utils/helpers";

export const markdownToHtml = (markdown: string): string => {
  const elements = parseMarkdown(markdown);
  let html = elements.map(elementToHtml).join("");
  html += globalScript();
  return html;
};
