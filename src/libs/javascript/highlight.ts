import { reservedKeywords } from "./keywords";
import { escapeHtml } from "../../utils/helpers";

export const highlightJavaScript = (code: string): string => {
  let highlighted = code;

  // Highlight reserved keywords
  reservedKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    highlighted = highlighted.replace(regex, `<span class="md-keyword">${escapeHtml(keyword)}</span>`);
  });

  return highlighted;
};
