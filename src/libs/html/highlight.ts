import { reservedKeywords } from "./keywords";

export const highlightHtml = (code: string): string => {
  // Step 1: Escape HTML entities
  let escapedCode = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/`/g, "&#x60;"); // Escape backticks as &#x60;

  // e.g. class="my-class" OR class=&quot;my-class&quot;
  escapedCode = escapedCode.replace(/ ([a-zA-Z0-9-]+)=&quot;([a-zA-Z0-9-]+)&quot;/g, ` <span class="md-special">$1=&quot;$2&quot;</span>`);

  // e.g. "https://example.com"
  escapedCode = escapedCode.replace(/&quot;https:\/\/(.+)&quot;/g, `<span class="md-string">&quot;https:\\\\\$1&quot;</span>`);

  // Highlight HTML comments
  escapedCode = escapedCode.replace(/&lt;!--(.*?)--&gt;/g, `<span class="md-comment">&lt;!--$1--&gt;</span>`);

  // Step 2: Highlight reserved keywords
  reservedKeywords.forEach((keyword) => {
    const regexClose = new RegExp(`&lt;/${keyword}&gt;`, "g");
    escapedCode = escapedCode.replace(regexClose, `<span class="md-keyword">&lt;/${keyword}&gt;</span>`);

    const regexOpen = new RegExp(`&lt;${keyword}&gt;`, "g");
    escapedCode = escapedCode.replace(regexOpen, `<span class="md-keyword">&lt;${keyword}&gt;</span>`);

    const regexSpecialOpen = new RegExp(`&lt;${keyword} `, "g");
    escapedCode = escapedCode.replace(regexSpecialOpen, `<span class="md-keyword">&lt;${keyword} </span>`);
  });

  return escapedCode;
};
