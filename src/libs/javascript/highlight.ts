import { reservedKeywords } from "./keywords";
import { escapeHtml } from "../../utils/helpers";

export const highlightJavaScript = (code: string): string => {
  // Escape HTML entities
  code = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;");

  // Check if there's an opening comment but no closing comment
  const hasOpenComment = /\/\*/g.test(code);
  const hasCloseComment = /\*\//g.test(code);

  // Return early if there's an opening or closing comment without its counterpart
  if ((hasOpenComment && !hasCloseComment) || (!hasOpenComment && hasCloseComment)) {
    return code; // Return early if the code does not have a complete multi-line comment
  }

  // Highlight comments
  const commentRegex = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
  let highlighted = code.replace(commentRegex, '<span class="md-comment">$1</span>');

  // Highlight strings that are not inside comments
  highlighted = highlighted.replace(/<span class="md-comment">.*?<\/span>|(["'`])(.*?)(\1)/g, (match, p1, p2, p3) => {
    // If it's a comment, return it unchanged
    if (match.startsWith('<span class="md-comment">')) return match;
    // Otherwise, highlight the string
    return `<span class="md-string">${p1}${p2}${p3}</span>`;
  });

  // Highlight specific RegExp patterns
  const regexEqualsPattern = /=([\s+]?\/.*\/[gimuy]*;)/g;
  highlighted = highlighted.replace(regexEqualsPattern, '=<span class="md-regex">$1</span>');

  const regexTestPattern = /([\s+]?\/.*\/[gimuy]*).test/g;
  highlighted = highlighted.replace(regexTestPattern, '<span class="md-regex">$1</span>.test');

  const blockCommentRegex = /\/\*(.*)\*\//g;
  highlighted = highlighted.replace(blockCommentRegex, `<span class="md-comment">&sol;&ast;$1&ast;&sol;</span>`);

  // Highlight decorators
  const decoratorRegex = /(^|\s)@[\w]+/gm;
  highlighted = highlighted.replace(decoratorRegex, '<span class="md-decorator">$&</span>');

  // Arrow functions
  const arrowFuncRegex = /(\w+)\s*=\s*\(([^)]+)\)/gi;
  highlighted = highlighted.replace(arrowFuncRegex, '<span class="md-special">$1</span> = ($2)');

  // if() statements and other function/method calls and declarations (with space between keywords and parenth)
  const declareFuncRegexWithSpace = /(\w+\s+[if]) \s*\(([^)]*)\)/gi;
  highlighted = highlighted.replace(declareFuncRegexWithSpace, '<span class="md-special">$1</span> ($2)');

  // Function/method calls and declarations (without space)
  const declareFuncRegex = /(\w+\s+[if])\s*\(([^)]*)\)/gi;
  highlighted = highlighted.replace(declareFuncRegex, '<span class="md-special">$1</span>($2)');

  // Highlight code like `function funcName(`
  const functionDeclareRe = /function (\w+)\(/g;
  highlighted = highlighted.replace(functionDeclareRe, 'function <span class="md-special">$1</span>(');

  // Highlight code like `function funcName(`
  const constFuncDeclareRe = /const (\w+) =/g;
  highlighted = highlighted.replace(constFuncDeclareRe, 'const <span class="md-special">$1</span> =');

  // Class declaration statements
  const classDeclareRegex = /^(?:export\s+)?class\s+([A-Z][a-zA-Z0-9_]*)/gi;
  highlighted = highlighted.replace(classDeclareRegex, (match, className) => {
    return match.replace(className, `<span class="md-class">${className}</span>`);
  });

  // Highlight method calls like `.myMethod(` or `.myFunc(`
  const methodCallRegEx = /\.(\w+)\(/g;
  highlighted = highlighted.replace(methodCallRegEx, '.<span class="md-call-method">$1</span>(');

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

  return replaceKeywords(highlighted);
};
