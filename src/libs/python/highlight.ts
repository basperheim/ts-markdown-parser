import { reservedKeywords } from "./keywords";
import { pythonStandardLibrary } from "./libs";
import { escapeHtml } from "../../utils/markdown-parser";

export const highlightPython = (code: string): string => {
  // Escape HTML entities
  code = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`/g, "&#x60;");
  let highlighted = code;

  // Regex to match strings (single and double quotes)
  if (!code.includes(`"""`)) {
    const stringRegex = /(?:r|R)?(["'])(?:\\.|(?!\1).)*\1/g;
    highlighted = code.replace(stringRegex, '<span class="md-string">$&</span>');
  }

  // Regex to match single-line comments
  const singleLineCommentRegex = /(#.*)/g;
  highlighted = highlighted.replace(singleLineCommentRegex, '<span class="md-comment">$&</span>');

  // Highlight decorators
  const decoratorRegex = /(^|\s)@[\w]+/gm;
  highlighted = highlighted.replace(decoratorRegex, '<span class="md-decorator">$&</span>');

  // Highlight function calls
  const funcCallRegex = /(\b\w+)\s*\(([^)]*)\)/g;
  highlighted = highlighted.replace(funcCallRegex, '<span class="md-special">$1</span>($2)');

  // Highlight class declarations
  const classDeclareRegex = /^class\s+([A-Z][a-zA-Z0-9_]*)/gi;
  highlighted = highlighted.replace(classDeclareRegex, 'class <span class="md-class">$1</span>');

  // Function to prevent keyword replacement inside already wrapped <span> elements
  const replaceKeywords = (text: string): string => {
    return text.replace(/(<span[^>]*>.*?<\/span>)|(\b\w+\b)/g, (match, span, word) => {
      if (span) return span; // Skip spans
      if (word && reservedKeywords.includes(word)) {
        return `<span class="md-keyword">${escapeHtml(word)}</span>`;
      }

      if (word && pythonStandardLibrary.includes(word)) {
        return `<span class="md-call-method">${escapeHtml(word)}</span>`;
      }
      return word;
    });
  };

  // Highlight reserved keywords
  return replaceKeywords(highlighted);
};
