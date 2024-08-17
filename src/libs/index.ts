import { highlightJavaScript } from "./javascript/highlight";
import { highlightPython } from "./python/highlight";
import { highlightHtml } from "./html/highlight";
import { Language, LanguageType } from "../models";

// Mapping from aliases to full language names
export const languageAliases: Record<string, LanguageType> = {
  js: "javascript",
  javascript: "javascript",
  python: "python",
  py: "python",
  html: "html",
};

// Ensure all Language types are covered in highlightFunctions
type HighlightFunction = (code: string) => string;

const highlightFunctions: Record<LanguageType, HighlightFunction> = {
  javascript: highlightJavaScript,
  js: highlightJavaScript,
  python: highlightPython,
  py: highlightPython,
  html: highlightHtml,
};

export const highlightCode = (language: string, code: string): string => {
  const normalizedLanguage = languageAliases[language] || language;
  const highlightFunction = highlightFunctions[normalizedLanguage as LanguageType];
  return highlightFunction ? highlightFunction(code) : code;
};
