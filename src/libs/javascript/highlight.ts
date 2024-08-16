import { reservedKeywords } from "./keywords";

export function highlightJavaScript(code: string): string {
  let highlighted = code;

  // Highlight reserved keywords
  reservedKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
  });

  // Other highlighting logic (e.g., functions, variables) would go here

  return highlighted;
}