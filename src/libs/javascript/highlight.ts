import { reservedKeywords } from "./keywords";
import { escapeHtml } from "../../utils/helpers";

export const highlightJavaScript = (code: string): string => {
  // Regex to match strings, ignoring double quotes inside class attributes
  const regexString = /(["'`])(.*?)(\1)/g;
  let highlighted = code.replace(regexString, '<span class="md-string">$1$2$3</span>');

  // Function to prevent keyword replacement inside already wrapped <span> elements
  const replaceKeywords = (text: string): string => {
    return text.replace(/(<span[^>]*>.*?<\/span>)|(\b\w+\b)/g, (match, span, word) => {
      if (span) return span; // Skip spans
      if (word && reservedKeywords.includes(word)) {
        return `<span class="md-keyword">${escapeHtml(word)}</span>`;
      }
      return word;
    });
  };

  // Highlight reserved keywords
  highlighted = replaceKeywords(highlighted);

  return highlighted;
};
