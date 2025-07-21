import { rustKeywords, rustSpecial, rustLogicalOps } from "./keywords";

// Quick helper
const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`/g, "&#x60;");

// Regex that matches any logical operator (escaped as needed)
const opsPattern = new RegExp(rustLogicalOps.map((op) => op.replace(/([|\\^$*+?.(){}\[\]])/g, "\\$1")).join("|"), "g");

export const highlightRust = (code: string): string => {
  // 1. Escape HTML entities
  let line = escapeHtml(code);

  // 2. Handle line and block comments (block comments: /* ... */)
  if (line.trim().startsWith("//")) {
    return `<span class="md-comment">${line}</span>`;
  }
  if (line.trim().startsWith("/*") || line.trim().endsWith("*/")) {
    return `<span class="md-comment">${line}</span>`;
  }

  // **Lifetimes first, before strings**
  // 3. Lifetimes (e.g. 'a, 'static), must not be inside a string
  line = line.replace(/('[a-zA-Z_][a-zA-Z0-9_]*)/g, '<span class="md-special">$1</span>');

  // 4. Strings (double, then single; won't hit lifetimes anymore)
  line = line.replace(/"(?:\\.|[^"\\])*"/g, '<span class="md-string">$&</span>');
  // Single quoted chars (not lifetimes): only match if single char between single quotes
  line = line.replace(/'([^'\\])'/g, "<span class=\"md-string\">'$1'</span>");

  // 5. Macros (identifiers ending in !, e.g. println!)
  line = line.replace(/(\b\w+)!/g, '<span class="md-macro">$1!</span>');

  // 6. Numbers
  line = line.replace(/\b\d+(\.\d+)?\b/g, '<span class="md-number">$&</span>');

  // 7. Highlight keywords, types, primitives (skip inside spans)
  line = line.replace(/(<span[^>]+>.*?<\/span>)|(\b\w+\b)/g, (m, span, word) => {
    if (span) return span;
    if (rustKeywords.includes(word)) return `<span class="md-keyword">${word}</span>`;
    if (rustSpecial.includes(word)) return `<span class="md-special">${word}</span>`;

    return word;
  });

  // 5a. macro_rules! as md-special (must be before general macro highlight)
  line = line.replace(/\bmacro_rules!/, '<span class="md-decorator">macro_rules!</span>');

  // 5b. Macros (identifiers ending in !, e.g. println!)
  line = line.replace(/(\b\w+)!/g, '<span class="md-decorator">$1!</span>');

  return line;
};
