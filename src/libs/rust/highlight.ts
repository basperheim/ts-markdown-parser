import { rustKeywords, rustSpecial } from "./keywords";

// Quick helper
const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`/g, "&#x60;");

export const highlightRust = (code: string): string => {
  let line = escapeHtml(code);

  // Comments (full-line and inline)
  const trimmed = line.trim();
  if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.endsWith("*/")) {
    return `<span class="md-comment">${line}</span>`;
  }
  // Inline comment
  const commentIdx = line.indexOf("//");
  let codePart = line,
    commentPart = "";
  if (commentIdx >= 0) {
    codePart = line.slice(0, commentIdx);
    commentPart = line.slice(commentIdx);
  }

  // Lifetimes (do first, outside strings)
  codePart = codePart.replace(/('[a-zA-Z_][a-zA-Z0-9_]*)/g, '<span class="md-special">$1</span>');

  // Strings (double, then char)
  codePart = codePart.replace(/"(?:\\.|[^"\\])*"/g, '<span class="md-string">$&</span>');
  codePart = codePart.replace(/'([^'\\])'/g, `<span class="md-string">'$1'</span>`);

  // macro_rules! as md-decorator
  codePart = codePart.replace(/\bmacro_rules!/, '<span class="md-decorator">macro_rules!</span>');
  // Macros (foo!)
  codePart = codePart.replace(/(\b\w+)!/g, '<span class="md-macro">$1!</span>');

  // Numbers
  codePart = codePart.replace(/\b\d+(\.\d+)?\b/g, '<span class="md-number">$&</span>');

  // Main pass: keywords and specials, skip inside spans
  codePart = codePart.replace(/(<span[^>]+>.*?<\/span>)|(\b\w+\b)/g, (m, span, word) => {
    if (span) return span;
    if (word) {
      if (rustKeywords.includes(word)) return `<span class="md-keyword">${word}</span>`;
      if (rustSpecial.includes(word)) return `<span class="md-special">${word}</span>`;
      return word;
    }
    return m;
  });

  // Inline comment at end
  if (commentPart) {
    codePart += `<span class="md-comment">${escapeHtml(commentPart)}</span>`;
  }

  return codePart;
};
