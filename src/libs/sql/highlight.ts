import { escapeHtml } from "../../utils/markdown-parser";
import { reservedKeywords, sqlDataTypes, sqlFunctions } from "./keywords";

/**
 * Highlights SQL code blocks with syntax highlighting.
 *
 * @param {string} code - The SQL code as a string.
 * @returns {string} - The highlighted HTML string.
 */
export const highlightSQL = (code: string): string => {
  // Escape HTML entities
  let escapedCode = escapeHtml(code);

  // Highlight strings (single quotes) and identifiers (double quotes) in SQL
  const stringRegex = /'(?:''|[^'])*'|"(?:""|[^"])*"/g;
  escapedCode = escapedCode.replace(stringRegex, '<span class="md-string">$&</span>');

  // Highlight comments (single-line and multi-line)
  const commentRegex = /(--.*$|\/\*[\s\S]*?\*\/)/gm;
  escapedCode = escapedCode.replace(commentRegex, '<span class="md-comment">$&</span>');

  // Split the code into parts: strings, comments, and other code
  const codeParts = escapedCode.split(/(<span class="md-string">[\s\S]*?<\/span>|<span class="md-comment">[\s\S]*?<\/span>)/g);

  // Process each part
  escapedCode = codeParts
    .map((part) => {
      if (part.startsWith('<span class="md-string">') || part.startsWith('<span class="md-comment">')) {
        // It's a string or comment, leave it as is
        return part;
      } else {
        let newPart = part;

        // Highlight SQL reserved keywords
        reservedKeywords.forEach((keyword) => {
          const regexKeyword = new RegExp(`\\b(${keyword})\\b`, "g");
          newPart = newPart.replace(regexKeyword, '<span class="md-keyword">$1</span>');
        });

        // Highlight SQL data types
        sqlDataTypes.forEach((keyword) => {
          const regexKeyword = new RegExp(`\\b(${keyword})\\b`, "g");
          newPart = newPart.replace(regexKeyword, '<span class="md-decorator">$1</span>');
        });

        // Highlight SQL built-in functions
        sqlFunctions.forEach((keyword) => {
          const regexKeyword = new RegExp(`\\b(${keyword})\\b`, "g");
          newPart = newPart.replace(regexKeyword, '<span class="md-call-method">$1</span>');
        });

        // Postgres `pg_` functions
        const pgFunctionRegex = /\b(pg_[a-zA-Z0-9_]+)(?=\s*\()/g;
        newPart = newPart.replace(pgFunctionRegex, '<span class="md-call-method">$1</span>');

        // Highlight `$$` in function declarations, and other operators
        newPart = newPart.replace(/(\$\$)/g, '<span class="md-decorator">$1</span>');
        newPart = newPart.replace(/(\:\:)/g, '<span class="md-decorator">$1</span>');
        newPart = newPart.replace(/\s(=)\s/g, '<span class="md-decorator">$1</span>');

        // Highlight numbers
        const numberRegex = /\b\d+(\.\d+)?\b/g;
        newPart = newPart.replace(numberRegex, '<span class="md-number">$&</span>');

        // Highlight parentheses and braces
        const parenthesesRegex = /[(){}[\]]/g;
        newPart = newPart.replace(parenthesesRegex, '<span class="md-special">$&</span>');

        // Highlight commas and semicolons
        const commaSemicolonRegex = /[;,]/g;
        newPart = newPart.replace(commaSemicolonRegex, '<span class="md-special">$&</span>');

        return newPart;
      }
    })
    .join("");

  return escapedCode;
};
