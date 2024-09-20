import { reservedKeywords } from "./keywords";

export const highlightCss = (code: string): string => {
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

  // Highlight SASS variable declaration
  escapedCode = escapedCode.replace(/(\$[a-zA-Z0-9_-]+)(?=\s*:)/g, `<span class="md-special">$1</span>`);

  // Highlight hex colors
  escapedCode = escapedCode.replace(/(\#[a-zA-Z0-9_-]+)(?=\s*;)/g, `<span class="md-special">$1</span>`);

  // Highlight strings (inside quotes)
  escapedCode = escapedCode.replace(/(&quot;.*?&quot;|'.*?')/g, '<span class="md-string">$1</span>');

  // Step 2: Highlight CSS comments
  escapedCode = escapedCode.replace(/\/\*(.*?)\*\//g, `<span class="md-comment">/*$1*/</span>`);

  // Step 3: Highlight CSS strings (inside quotes)
  escapedCode = escapedCode.replace(/(&quot;.*?&quot;|'.*?')/g, `<span class="md-string">$1</span>`);

  // Step 4: Highlight CSS properties/keywords
  const cssPropertyRegex = /([a-zA-Z-]+)(?=\s*:)/g;
  escapedCode = escapedCode.replace(cssPropertyRegex, '<span class="md-keyword">$1</span>');

  // Step 5: Highlight CSS numbers and units (e.g., px, em, rem, etc.)
  escapedCode = escapedCode.replace(/(\d*\.?\d+)(px|em|rem|%|vh|vw|vmin|vmax|deg)/g, `<span class="md-number">$1$2</span>`);

  // Step 6: Highlight CSS selectors (assumes anything before a curly brace could be a selector)
  escapedCode = escapedCode.replace(/([.#]?[a-zA-Z0-9_-]+)(?=\s*{)/g, `<span class="md-decorator">$1</span>`);

  // Step 7: Highlight CSS pseudo-classes (like :hover, :nth-child, etc.)
  escapedCode = escapedCode.replace(/(:[a-zA-Z0-9_-]+)/g, `<span class="md-decorator">$1</span>`);

  // Step 8: Highlight SCSS variables (starting with $)
  // escapedCode = escapedCode.replace(/(\$[a-zA-Z0-9_-]+)/g, `<span class="md-special">$1</span>`);

  return escapedCode;
};
