export type MarkdownElement = {
  type: string;
  content: string;
  language?: string;
};

export type Language = "javascript" | "python" | "html";

export const Language = {
  JAVASCRIPT: "javascript" as Language,
  PYTHON: "python" as Language,
  HTML: "html" as Language,
};
