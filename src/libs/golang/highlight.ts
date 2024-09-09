import { reservedKeywords } from "./keywords";
import { escapeHtml } from "../../utils/markdown-parser";

export const highlightGo = (code: string): string => {
  // Step 1: Escape HTML entities
  let escapedCode = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/`/g, "&#x60;"); // Escape backticks as &#x60;

  // Check if there's an opening comment but no closing comment
  const hasOpenComment = /\/\*/g.test(code);
  const hasCloseComment = /\*\//g.test(code);

  // Return early if there's an opening or closing comment without its counterpart
  if ((hasOpenComment && !hasCloseComment) || (!hasOpenComment && hasCloseComment)) {
    return code; // Return early if the code does not have a complete multi-line comment
  }

  // Highlight comments
  const commentRegex = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
  escapedCode = escapedCode.replace(commentRegex, '<span class="md-comment">$1</span>');

  // Highlight strings that are not inside comments
  escapedCode = escapedCode.replace(/<span class="md-comment">.*?<\/span>|(["'`])(.*?)(\1)/g, (match, p1, p2, p3) => {
    // If it's a comment, return it unchanged
    if (match.startsWith('<span class="md-comment">')) return match;
    // Otherwise, highlight the string
    return `<span class="md-string">${p1}${p2}${p3}</span>`;
  });

  // Highlight Go strings (inside quotes)
  escapedCode = escapedCode.replace(/(&quot;.*?&quot;|'.*?')/g, '<span class="md-string">$1</span>');

  // Step 4: Highlight Go keywords
  reservedKeywords.forEach((keyword) => {
    const regexKeyword = new RegExp(`(${keyword}\\s)`, "g");
    escapedCode = escapedCode.replace(regexKeyword, '<span class="md-keyword">$1</span>');
  });

  // Highlight Go numbers and units (e.g., int, float, string, etc.)
  escapedCode = escapedCode.replace(/(\d+(?:\.\d+)?)|([a-zA-Z]+)(?=\s*:)/g, '<span class="md-number">$1$2</span>');

  // Highlight Go selectors (assumes anything before a curly brace could be a selector)
  escapedCode = escapedCode.replace(/([.#]?[a-zA-Z0-9_-]+)(?=\s*{)/g, '<span class="md-decorator">$1</span>');

  // Highlight Go pseudo-classes (like :hover, :nth-child, etc.)
  escapedCode = escapedCode.replace(/(:[a-zA-Z0-9_-]+)/g, '<span class="md-decorator">$1</span>');

  // Highlight Go variables (starting with $)
  escapedCode = escapedCode.replace(/(\$[a-zA-Z0-9_-]+)/g, '<span class="md-special">$1</span>');

  // Highlight method calls like `.myMethod(` or `.myFunc(`
  const methodCallRegEx = /\.(\w+)\(/g;
  escapedCode = escapedCode.replace(methodCallRegEx, '.<span class="md-call-method">$1</span>(');

  // Highlight reserved keywords
  const replaceKeywords = (text: string): string => {
    return text.replace(/(<span[^>]*>.*?<\/span>)|(\b\w+\b)/g, (match, span, word) => {
      if (span) return span; // Skip spans
      if (word && reservedKeywords.includes(word)) {
        return `<span class="md-keyword">${escapeHtml(word)}</span>`;
      }
      return word;
    });
  };

  return replaceKeywords(escapedCode);
};
