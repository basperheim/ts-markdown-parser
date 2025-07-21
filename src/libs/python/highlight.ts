import { reservedKeywords } from "./keywords";
import { pythonStandardLibrary } from "./libs";
import { escapeHtml } from "../../utils/markdown-parser";

export const highlightPython = (line: string): string => {
  // Escape HTML entities
  line = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`/g, "&#x60;");

  // Find the first #, but ignore if it's the first non-whitespace char (whole line is a comment)
  // (You can tweak this to be more robust with a parser if you want to ignore # inside strings, but for Markdown, this is fine)
  const hashIdx = line.indexOf("#");
  if (hashIdx === -1) {
    // No comment on this line; highlight all
    return highlightPythonCode(line);
  }

  // If # is the first non-whitespace, treat whole line as comment
  if (/^\s*#/.test(line)) {
    return `<span class="md-comment">${escapeHtml(line)}</span>`;
  }

  // Otherwise, split code and comment
  const codePart = line.slice(0, hashIdx);
  const commentPart = line.slice(hashIdx);

  // Highlight code part only
  const codeHighlighted = highlightPythonCode(codePart);

  // Wrap comment with NO inner highlight
  return codeHighlighted + `<span class="md-comment">${escapeHtml(commentPart)}</span>`;
};

// Helper: Only highlight code, never wrap comments here
function highlightPythonCode(code: string): string {
  // Strings
  const stringRegex = /(?:r|R)?(["'])(?:\\.|(?!\1).)*\1/g;
  let highlighted = code.replace(stringRegex, '<span class="md-string">$&</span>');

  // Decorators
  const decoratorRegex = /(^|\s)@[\w]+/gm;
  highlighted = highlighted.replace(decoratorRegex, '<span class="md-decorator">$&</span>');

  // Function calls
  const funcCallRegex = /(\b\w+)\s*\(([^)]*)\)/g;
  highlighted = highlighted.replace(funcCallRegex, '<span class="md-special">$1</span>($2)');

  // Class declarations
  const classDeclareRegex = /^class\s+([A-Z][a-zA-Z0-9_]*)/gi;
  highlighted = highlighted.replace(classDeclareRegex, 'class <span class="md-class">$1</span>');

  // Keywords and stdlib
  highlighted = highlighted.replace(/(<span[^>]*>.*?<\/span>)|(\b\w+\b)/g, (match, span, word) => {
    if (span) return span;
    if (word && reservedKeywords.includes(word)) {
      return `<span class="md-keyword">${escapeHtml(word)}</span>`;
    }
    if (word && pythonStandardLibrary.includes(word)) {
      return `<span class="md-call-method">${escapeHtml(word)}</span>`;
    }
    return word;
  });

  return highlighted;
}
