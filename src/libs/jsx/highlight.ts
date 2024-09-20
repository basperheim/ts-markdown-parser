import { reservedKeywords as jsKeywords } from "../javascript/keywords";
import { reservedKeywords as htmlKeywords } from "../html/keywords";
import { reservedKeywords as jsxKeywords } from "./keywords";
const reservedKeywords = [...jsKeywords, ...htmlKeywords];

/**
 * Highlights JSX/TSX attributes within a JSX tag.
 *
 * @param {string} attributes - The string containing JSX attributes.
 * @returns {string} - The highlighted attributes string.
 */
const highlightJSXAttributes = (attributes: string): string => {
  // Highlight attribute names
  const attrNameRegex = /(\w+)=/g;
  let highlightedAttrs = attributes.replace(attrNameRegex, '<span class="md-special">$1</span>=');

  // Highlight attribute values (strings and expressions)
  const attrValueRegex = /=(["'])(.*?)\1/g;
  highlightedAttrs = highlightedAttrs.replace(attrValueRegex, '="<span class="md-special">$2</span>"');

  // Highlight expressions within attribute values
  const exprValueRegex = /=\{(.*?)\}/g;
  highlightedAttrs = highlightedAttrs.replace(exprValueRegex, '={<span class="md-special">$1</span>}');

  return highlightedAttrs;
};

/**
 * Replaces reserved JavaScript and JSX keywords with highlighted spans.
 *
 * @param {string} text - The text to process.
 * @returns {string} - The text with highlighted keywords.
 */
const replaceKeywords = (text: string): string => {
  return text.replace(/(<span[^>]*>.*?<\/span>)|(\b\w+\b)/g, (match, span, word) => {
    if (span) return span; // Skip already highlighted spans
    if (word && reservedKeywords.includes(word)) {
      return `<span class="md-keyword">${word}</span>`;
    } else if (word && jsxKeywords.includes(word)) {
      return `<span class="md-decorator">${word}</span>`;
    }
    return word;
  });
};

/**
 * Highlights JSX (React/Next.js) code blocks with syntax highlighting.
 *
 * @param {string} code - The JSX code as a string.
 * @returns {string} - The highlighted HTML string.
 */
export const highlightJSX = (code: string): string => {
  // Step 1: Escape HTML entities
  code = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;");

  // Step 2: Check for incomplete comments
  const hasOpenComment = /\/\*/.test(code);
  const hasCloseComment = /\*\//.test(code);

  if ((hasOpenComment && !hasCloseComment) || (!hasOpenComment && hasCloseComment)) {
    return code; // Return early if comments are incomplete
  }

  // Step 3: Highlight comments (both single-line and multi-line)
  const commentRegex = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
  let highlighted = code.replace(commentRegex, '<span class="md-comment">$1</span>');

  // Step 4: Highlight strings not inside comments
  highlighted = highlighted.replace(/<span class="md-comment">.*?<\/span>|(["'`])(.*?)(\1)/g, (match, p1, p2, p3) => {
    if (match.startsWith('<span class="md-comment">')) return match;
    return `<span class="md-string">${p1}${p2}${p3}</span>`;
  });

  // Step 5: Highlight regular expressions
  const regexEqualsPattern = /=([\s+]?\/.*?\/[gimuy]*)/g;
  highlighted = highlighted.replace(regexEqualsPattern, '=<span class="md-regex">$1</span>');

  const regexTestPattern = /([\s+]?\/.*?\/[gimuy]*)\.test/g;
  highlighted = highlighted.replace(regexTestPattern, '<span class="md-regex">$1</span>.test');

  // Step 6: Highlight decorators (e.g., @Component)
  const decoratorRegex = /(^|\s)@[\w]+/gm;
  highlighted = highlighted.replace(decoratorRegex, '$1<span class="md-decorator">$&</span>');

  // Step 7: Highlight JSX tags and attributes
  // a. Highlight opening and closing tags
  const jsxTagRegex = /&lt;\/?([A-Z][A-Za-z0-9_]*)\b([^&]*?)&gt;/g;
  highlighted = highlighted.replace(jsxTagRegex, (match, p1, p2) => {
    return `&lt;<span class="md-decorator">${p1}</span>${highlightJSXAttributes(p2)}&gt;`;
  });

  // b. Highlight self-closing tags
  const jsxSelfClosingTagRegex = /&lt;([A-Z][A-Za-z0-9_]*)\b([^&]*?)\/&gt;/g;
  highlighted = highlighted.replace(jsxSelfClosingTagRegex, (match, p1, p2) => {
    return `&lt;<span class="md-decorator">${p1}</span>${highlightJSXAttributes(p2)} /&gt;`;
  });

  // Step 8: Highlight embedded JavaScript expressions within JSX
  const jsxExpressionRegex = /{([^}]+)}/g;
  highlighted = highlighted.replace(jsxExpressionRegex, '<span class="md-special">{$1}</span>');

  // Step 9: Highlight reserved keywords
  highlighted = replaceKeywords(highlighted);

  return highlighted;
};
