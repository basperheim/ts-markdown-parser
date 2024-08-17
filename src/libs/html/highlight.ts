// import { reservedKeywords } from "./keywords";
const reservedKeywords: string[] = [];

export function highlightHtml(code: string): string {
  let highlighted = code;

  // Highlight reserved keywords
  reservedKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    highlighted = highlighted.replace(regex, `<span class="md-keyword">${keyword}</span>`);
  });

  // Other highlighting logic (e.g., functions, variables) would go here

  return highlighted;
}
