import { reservedKeywords } from "./keywords";

export const highlightGo = (code: string): string => {
  let escapedCode = code
    .replace(/&/g, "&amp;")
    .replace(/:\/\//g, ":&#47;&#47;") // The `://` part of URLs
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\\'/g, "&#039;") // Replace escaped single quotes
    .replace(/'/g, "&#039;") // Replace unescaped single quotes
    .replace(/\\"/g, "&quot;") // Replace escaped double quotes
    .replace(/"/g, "&quot;") // Replace unescaped double quotes
    .replace(/`/g, "&#x60;"); // Escape backticks as &#x60;

  // Highlight comments (single-line and block comments)
  const commentRegex = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
  escapedCode = escapedCode.replace(commentRegex, '<span class="md-comment">$1</span>');

  const commentSpanRegex = /<span class="md-comment">.*?<\/span>|([^<]+)(?=<span class="md-comment">|$)/g;
  return escapedCode.replace(commentSpanRegex, (match, code) => {
    // If the match is a comment span, return it unchanged
    if (match.startsWith('<span class="md-comment">')) {
      return match;
    }

    const stringRegex = /(&quot;|&#039;|&#x60;)(.*?)(\1)/g;
    code = code.replace(stringRegex, '<span class="md-string">$1$2$3</span>');
    if (code.includes('<span class="md-string"')) {
      // return code;
    }

    // Highlight reserved keywords
    const replaceKeywords = (text: string): string => {
      return text.replace(/(<span[^>]*>.*?<\/span>)|(\b\w+\b)/g, (match, span, word) => {
        if (span) return span; // Skip spans
        if (word && reservedKeywords.includes(word)) {
          return `<span class="md-keyword">${word}</span>`;
        }
        return word;
      });
    };

    code = replaceKeywords(code);
    return code;

    // TODO: The code after this is not working, because of `md-string` issues
    // TODO: Fix this sometime, test, debug, etc..

    const mdSpanRegexComplete = /(<span class="md-[^"]*">)([\s\S]*?)(<\/span>)/;
    const mdSpanRegexPart = /(<span class="md-[^"]*">)/;

    // Highlight Go numbers
    code = code.replace(/(\d+(?:\.\d+)?)/g, '<span class="md-number">$1</span>');

    // Highlight Go selectors (assumes anything before a curly brace could be a selector)
    const libMethodCallStr = `<span class="md-special">$1</span>$2<span class="md-call-method">$3</span>`;
    code = code.replace(/([a-zA-Z0-9_-]+)(\.)([a-zA-Z0-9_-]+)(?=\s*[\{(])/g, libMethodCallStr);

    // Highlight Go pseudo-classes (like :hover, :nth-child, etc.)
    code = code.replace(/(:[a-zA-Z0-9_-]+)/g, '<span class="md-decorator">$1</span>');

    // Highlight Go variables (starting with $)
    code = code.replace(/(\$[a-zA-Z0-9_-]+)/g, '<span class="md-special">$1</span>');

    // Highlight other method calls like `.myMethod(` or `.myFunc(`
    const methodCallRegEx = /\.(\w+)\(/g;
    return code.replace(methodCallRegEx, '.<span class="md-call-method">$1</span>(');
  });
};
