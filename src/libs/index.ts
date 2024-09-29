import { highlightJavaScript } from "./javascript/highlight";
import { highlightPython } from "./python/highlight";
import { highlightHtml } from "./html/highlight";
import { highlightCss } from "./css/highlight";
import { highlightGo } from "./golang/highlight";
import { highlightJSX } from "./jsx/highlight";
import { highlightSQL } from "./sql/highlight";
import { highlightLua } from "./lua/highlight";

// Mapping from aliases to full language names
export const languageAliases: Record<string, string> = {
  js: "javascript",
  javascript: "javascript",
  typescript: "javascript",
  ts: "javascript",
  python: "python",
  py: "python",
  html: "html",
  css: "css",
  scss: "scss",
  go: "golang",
  golang: "golang",
  jsx: "jsx",
  tsx: "jsx",
  sql: "sql",
  lua: "lua",
};

// Ensure all Language types are covered in highlightFunctions
type HighlightFunction = (code: string) => string;

const highlightFunctions: Record<string, HighlightFunction> = {
  javascript: highlightJavaScript,
  js: highlightJavaScript,
  ts: highlightJavaScript,
  typescript: highlightJavaScript,
  python: highlightPython,
  py: highlightPython,
  html: highlightHtml,
  css: highlightCss,
  scss: highlightCss,
  go: highlightGo,
  golang: highlightGo,
  jsx: highlightJSX,
  tsx: highlightJSX,
  sql: highlightSQL,
  lua: highlightLua,
};

const cssStart = /(^\/\*)/;
const cssEnd = /(^\*\/|^\s\*\/)/;
const regexJavaScriptStart = /(^\/\*\*|^\/\*|\s\/\*\*|\s\/\*)/; // Matches /* and /** but not * or **
const regexJavaScriptEnd = /(^\*\/|\s\*\/)/; // Matches `*/` or ` */`
const regexPython = /('''|""")/; // Matches the start of a Python multiline comment (''' or """)
const goRegexStart = /(\/\*)/; // Go block comment start
const goRegexEnd = /(\*\/)/; // Go block comment end

export interface MultilineCommentRegex {
  start: RegExp;
  end: RegExp;
}

const multilineCommentMap: Record<string, MultilineCommentRegex> = {
  javascript: { start: regexJavaScriptStart, end: regexJavaScriptEnd },
  js: { start: regexJavaScriptStart, end: regexJavaScriptEnd },
  typescript: { start: regexJavaScriptStart, end: regexJavaScriptEnd },
  jsx: { start: regexJavaScriptStart, end: regexJavaScriptEnd },
  tsx: { start: regexJavaScriptStart, end: regexJavaScriptEnd },
  ts: { start: regexJavaScriptStart, end: regexJavaScriptEnd },
  python: { start: regexPython, end: regexPython },
  py: { start: regexPython, end: regexPython },
  html: { start: /<!--/, end: /-->/ }, // HTML comments are not multiline but for structure
  css: { start: cssStart, end: cssEnd },
  scss: { start: cssStart, end: cssEnd },
  go: { start: goRegexStart, end: goRegexEnd },
  golang: { start: goRegexStart, end: goRegexEnd },
  sql: { start: /\/\*/, end: /\*\// },
  lua: { start: /(^--\[\[)/, end: /(^--\]\]|^]])/ }, // Lua block comments
};

export const getMultilineCommentRegex = (language: string): MultilineCommentRegex | null => {
  return multilineCommentMap[language] || null;
};

export const highlightCode = (language: string, code: string): string => {
  const normalizedLanguage = languageAliases[language] || language;
  const highlightFunction = highlightFunctions[normalizedLanguage as string];
  return highlightFunction ? highlightFunction(code) : code;
};

/**
 * Removes leading whitespace and newline characters from a string
 * until a non-whitespace/non-newline character is encountered.
 *
 * @param str - The input string to be processed.
 * @returns A string with leading whitespace/newlines removed.
 */
export const stripLeadingWhitespace = (str: string): string => {
  // Regular expression to match leading newlines and spaces
  const regex = /^[\s\n]+/;

  // Replace the leading whitespace and newlines with an empty string
  return str.replace(regex, "").trim();
};

/**
 * Counts the occurrences of a target, trimmed string in an array.
 *
 * @param {string[]} arr
 * @returns {number}
 */
export const countOccurrences = (arr: string[], target: string): number => {
  if (!arr || !arr.length) {
    return 0;
  }

  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    const str = arr[i].trim();
    if (target === str) {
      total++;
    }
  }

  return total;
};

/**
 * Replaces specified characters in a string, ignoring any characters that are part of HTML entities.
 *
 * @param {string} text
 * @param {string} replaceRegex
 * @param {string} replacement
 * @returns {string}
 */
export const markdownReplace = (text: string, replaceRegex: RegExp, replacement: string): string => {
  const htmlEntityRegex = /(&.+;)(.*?)(\1)/gi;

  // Split the text by HTML entities
  const parts = text.split(htmlEntityRegex);

  const replacedParts = parts.map((item) => {
    // If it's an HTML entity, return it unchanged
    const isHTMLEntity = /(&.+;)(.*?)/g.test(item);
    if (isHTMLEntity) return item;

    // If it's a `<span class="md` element, return it unchanged
    // const spanRegex = new RegExp(`<span class="md-'`, "g");
    // const isSpan = spanRegex.test(item);
    // if (isSpan) return item;

    return item.replace(replaceRegex, replacement);
  });

  return replacedParts.join("");
};
