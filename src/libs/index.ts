import { highlightJavaScript } from "./javascript/highlight";
import { highlightPython } from "./python/highlight";
import { highlightHtml } from "./html/highlight";

export type Language = "javascript" | "python" | "html";

export const Language = {
  JAVASCRIPT: "javascript" as Language,
  PYTHON: "python" as Language,
  HTML: "html" as Language,
};

type HighlightFunction = (code: string) => string;

const highlightFunctions: Record<Language, HighlightFunction> = {
  javascript: highlightJavaScript,
  python: highlightPython,
  html: highlightHtml,
};

export const highlightCode = (language: Language, code: string): string => {
  const highlightFunction = highlightFunctions[language];
  return highlightFunction ? highlightFunction(code) : code;
};
