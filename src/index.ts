import { parseMarkdown, elementToHtml, globalScript, checkboxScript } from "./utils/markdown-parser";
import { parseMetadata } from "./utils/metadata-parser";
let warnedDeprecatedBoolean = false;

type MarkdownToHtmlOptions = {
  addCopyToClipboard?: boolean;
  interactiveCheckboxes?: boolean;
  // ...future options
};

/**
 * Converts a Markdown string into an HTML string.
 *
 * @param {string} markdown - The Markdown content to be converted to HTML.
 * @param {boolean|MarkdownToHtmlOptions} opts - Adds "Copy" button to HTML `<code>` blocks (legacy) or options object.
 * @returns {string} The resulting HTML content.
 */
export const markdownToHtml = (markdown: string, opts: boolean | MarkdownToHtmlOptions = true): string => {
  // Backward compatibility: support old boolean param for addCopyToClipboard

  //! Parse as boolean or object key, but default to `true` in either case (THIS BOOLEAN IS DEPRECATED)
  const addCopyToClipboard = opts === false || (typeof opts === "object" && opts.addCopyToClipboard === false) ? false : true;

  // Only parse as `opts` object key, but have false by default, therefore `opts.interactiveCheckboxes` must be an explicitly `true` opts key-value
  const interactiveCheckboxes = typeof opts === "object" ? !!opts?.interactiveCheckboxes : false;

  // Pass interactiveCheckboxes to parseMarkdown/elementToHtml as needed
  const elements = parseMarkdown(markdown);
  let html = "";

  // 🔥 Deprecation Warning
  if (typeof opts === "boolean" && !warnedDeprecatedBoolean) {
    console.warn("\x1b[33m[markdownToHtml] Passing a boolean as the 2nd arg is deprecated. Please use an options object.\x1b[37m");
    warnedDeprecatedBoolean = true;
  }

  const totalEles = elements.length;
  for (let i = 0; i < totalEles; i++) {
    const opts = { addCopyToClipboard };
    html += elementToHtml(elements[i], opts);
  }

  if (interactiveCheckboxes && html.includes(`<li class="md-checkbox">`) && html.includes(`type="checkbox" disabled`)) {
    const disabledCheckboxRe = /<input type="checkbox" disabled/gm;
    html = html.replace(disabledCheckboxRe, `<input type="checkbox"`);
    html += checkboxScript();
  }

  if (addCopyToClipboard && html.includes(`<div class="md-code-container"`)) {
    html += globalScript();
  }

  return html;
};

/**
 * Extracts metadata from a Markdown string.
 *
 * This function extracts and parses the YAML front matter from the Markdown content,
 * returning it as a JavaScript object.
 *
 * @param {string} markdown - The Markdown content from which to extract metadata.
 * @returns {Record<string, any>} An object containing the metadata extracted from the Markdown.
 *
 * @example
 * const markdown = `
 * ---
 * title: "Example Article"
 * author: "Author Name"
 * date: "2024-08-21"
 * ---
 * # Hello World
 * This is a test.
 * `;
 * const metadata = getMarkdownMetadata(markdown);
 * console.log(metadata); // Outputs the metadata object
 */
export const getMarkdownMetadata = (markdown: string): Record<string, any> => {
  return parseMetadata(markdown);
};
