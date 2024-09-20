import { escapeHtml } from "../../utils/markdown-parser";
import { reservedKeywords, sqlDataTypes } from "./keywords";

/**
 * Highlights SQL code blocks with syntax highlighting.
 *
 * @param {string} code - The SQL code as a string.
 * @returns {string} - The highlighted HTML string.
 */
export const highlightSQL = (code: string): string => {
  // Escape HTML entities
  let escapedCode = escapeHtml(code);

  // Highlight strings (single and double quotes)
  const stringRegex = /(['"])(?:(?=(\\?))\2.)*?\1/g;
  escapedCode = escapedCode.replace(stringRegex, '<span class="md-string">$&</span>');

  // Highlight SQL reserved keywords (any word before space, comma, parenthesis, etc.)
  reservedKeywords.forEach((keyword) => {
    const regexKeyword = new RegExp(`(${keyword})`, "g");
    escapedCode = escapedCode.replace(regexKeyword, '<span class="md-keyword">$1</span>');
  });

  sqlDataTypes.forEach((keyword) => {
    const regexKeyword = new RegExp(`(${keyword})`, "g");
    escapedCode = escapedCode.replace(regexKeyword, '<span class="md-decorator">$1</span>');
  });

  // Highlight `DO $$` function declaration in SQL
  escapedCode = escapedCode.replace(/(\$\$)/g, '<span class="md-decorator">$1</span>');

  // Highlight numbers
  const numberRegex = /\b\d+(\.\d+)?\b/g;
  escapedCode = escapedCode.replace(numberRegex, '<span class="md-number">$&</span>');

  // Highlight parentheses and braces
  const parenthesesRegex = /[(){}[\]]/g;
  escapedCode = escapedCode.replace(parenthesesRegex, '<span class="md-special">$&</span>');

  // Highlight commas and semicolons
  const commaSemicolonRegex = /[;,]/g;
  escapedCode = escapedCode.replace(commaSemicolonRegex, '<span class="md-special">$&</span>');

  // Comments
  const regexComment = /--(.*)/g;
  escapedCode = escapedCode.replace(regexComment, '<span class="md-comment">--$1</span>');

  return escapedCode;
};
