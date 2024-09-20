import { highlightJavaScript } from "./javascript/highlight";
import { highlightPython } from "./python/highlight";
import { highlightHtml } from "./html/highlight";
import { highlightCss } from "./css/highlight";
import { highlightGo } from "./golang/highlight";
import { highlightJSX } from "./jsx/highlight";

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
