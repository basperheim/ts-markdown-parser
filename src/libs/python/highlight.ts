import { reservedKeywords } from "./keywords";
import { escapeHtml } from "../../utils/helpers";

export function highlightPython(code: string): string {
  // Regex to match strings (single and triple quotes)
  const stringRegex = /(["'])(.*?)(\1)|("""[\s\S]*?""")/g;
  let highlighted = code.replace(stringRegex, '<span class="md-string">$&</span>');

  // Regex to match comments (single and triple quotes)
  const commentRegex = /(#.*|""".*?""")/gs;
  highlighted = highlighted.replace(commentRegex, '<span class="md-comment">$&</span>');

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
}
