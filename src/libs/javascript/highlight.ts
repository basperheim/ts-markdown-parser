import { reservedKeywords } from "./keywords";
import { escapeHtml } from "../../utils/helpers";

export const highlightJavaScript = (code: string): string => {
  // let highlighted = escapeHtml(code);
  let highlighted = code;

  // Highlight reserved keywords
  reservedKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    highlighted = highlighted.replace(regex, `<span class="keyword">${escapeHtml(keyword)}</span>`);
  });

  // Other highlighting logic (e.g., functions, variables) would go here

  return highlighted;
};
