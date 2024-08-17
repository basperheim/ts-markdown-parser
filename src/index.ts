import { parseMarkdown, elementToHtml } from "./utils/helpers";

export const markdownToHtml = (markdown: string): string => {
  const elements = parseMarkdown(markdown);
  return elements.map(elementToHtml).join("");
};
