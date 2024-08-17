export type MarkdownElement = {
  type: string;
  content: string;
  language?: string;
};

export type LanguageType = "js" | "javascript" | "python" | "py" | "html";

export const Language = {
  JAVASCRIPT: "javascript" as LanguageType,
  PYTHON: "python" as LanguageType,
  HTML: "html" as LanguageType,
  JS: "js" as LanguageType,
  PY: "py" as LanguageType,
};
