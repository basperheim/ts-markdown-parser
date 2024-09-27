import { reservedKeywords, reservedFunctions } from "./keywords";

/**
 * Highlights Lua code blocks with syntax highlighting.
 *
 * @param {string} code - The Lua code as a string.
 * @returns {string} - The highlighted HTML string.
 */
export const highlightLua = (code: string): string => {
  // Highlight comments
  const commentRegex = /(--[^\n]*)/g;
  code = code.replace(commentRegex, '<span class="md-comment">$1</span>');

  // Highlight strings that are not inside comments
  code = code.replace(/<span class="md-comment">.*?<\/span>|(["'`])(.*?)(\1)/g, (match, p1, p2, p3) => {
    // If it's a comment, return it unchanged
    if (match.startsWith('<span class="md-comment">')) return match;
    // Otherwise, highlight the string
    return `<span class="md-string">${p1}${p2}${p3}</span>`;
  });

  // Split the code into parts: strings, comments, and other code
  const codeParts = code.split(/(<span class="md-string">[\s\S]*?<\/span>|<span class="md-comment">[\s\S]*?<\/span>)/g);

  // Process each part
  code = codeParts
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
        reservedFunctions.forEach((func) => {
          const regexKeyword = new RegExp(`\\b(${func})\\b`, "g");
          newPart = newPart.replace(regexKeyword, '<span class="md-decorator">$1</span>');
        });

        // Highlight string operator
        const stringOperatorRegex = /(\.\.)/g;
        newPart = newPart.replace(stringOperatorRegex, '<span class="md-decorator">$&</span>');

        // Highlight calls like `myFunc()`
        const funcCallRegex = /(\w+)\(/g;
        newPart = newPart.replace(funcCallRegex, '<span class="md-call-method">$1</span>(');

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

  return code;
};
