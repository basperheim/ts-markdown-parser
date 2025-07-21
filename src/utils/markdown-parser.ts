import { MarkdownElement } from "../models";
import { highlightCode, stripLeadingWhitespace, countOccurrences, getMultilineCommentRegex, MultilineCommentRegex } from "../libs";

interface NestedCodeModel {
  action: "open" | "close" | "inside";
  lang: string;
}

// Helper: detect open/close tags (with attributes), and if on the same line
const detectNonHtmlCodeBlocks = (line: string, previous: string = "html"): NestedCodeModel | null => {
  const openScriptMatch = line.match(/<script/i);
  const closeScriptMatch = line.match(/<\/script>/i);
  const openStyleMatch = line.match(/<style/i);
  const closeStyleMatch = line.match(/<\/style>/i);

  if (previous !== "html") {
    if (closeScriptMatch || closeStyleMatch) {
      return { action: "close", lang: "html" };
    }
  }

  if (openScriptMatch) {
    return { action: "open", lang: "js" };
  } else if (closeScriptMatch) {
    return { action: "close", lang: "js" };
  } else if (openStyleMatch) {
    return { action: "open", lang: "css" };
  } else if (closeStyleMatch) {
    return { action: "close", lang: "css" };
  } else {
    // If no specific open/close tag is detected, return null or "other" action
    return { action: "inside", lang: typeof previous === "string" && previous ? previous : "html" };
  }
};

/**
 * Replaces reference links in markdown text with their corresponding titles and URLs.
 *
 * This function performs two passes over the markdown text:
 * 1. It captures reference definitions and stores them in a map.
 * 2. It replaces inline references with their corresponding titles and URLs.
 *
 * @param {string} markdown - The markdown text to process.
 * @returns {string} The processed markdown text with reference links replaced.
 */
export const replaceReferenceLinks = (markdown: string): string => {
  const lines = markdown.split("\n");
  const map: Record<string, { title: string; link: string }> = {};
  const newLines: string[] = [];

  const refDefRegex = /^\[(\d+)]\:\s*(\S+)\s*"(.+)"$/;
  const inlineRefRegex = /\[([^\]]+)]\[(\d+)]/g;
  const inlineCodeRegex = /`([^`]+)`/g;

  let isCodeBlock = false;

  // First pass: Capture reference defs, skip them from newLines
  for (const line of lines) {
    const trimmed = line.trimStart();

    if (trimmed.startsWith("```")) {
      isCodeBlock = !isCodeBlock;
      newLines.push(line);
      continue;
    }

    if (isCodeBlock) {
      newLines.push(line);
      continue;
    }

    const refMatch = line.match(refDefRegex);
    if (refMatch) {
      const [, refNum, url, title] = refMatch;
      map[refNum] = { title, link: url };
      continue; // Don't include ref def lines
    }

    newLines.push(line);
  }

  // Second pass: Replace annotations outside code blocks & inline code
  const finalLines: string[] = [];
  isCodeBlock = false;

  for (const line of newLines) {
    const trimmed = line.trimStart();

    if (trimmed.startsWith("```")) {
      isCodeBlock = !isCodeBlock;
      finalLines.push(line);
      continue;
    }

    if (isCodeBlock) {
      finalLines.push(line);
      continue;
    }

    // Mask inline code blocks
    const inlineCodeMatches: string[] = [];
    let maskedLine = line.replace(inlineCodeRegex, (match, code) => {
      inlineCodeMatches.push(match);
      return `{{INLINE_CODE_${inlineCodeMatches.length - 1}}}`;
    });

    // Replace [label][n] annotations
    maskedLine = maskedLine.replace(inlineRefRegex, (match, label, refNum) => {
      const ref = map[refNum];
      if (ref) {
        return `[${ref.title}](${ref.link})`;
      }
      return match;
    });

    // Restore inline code blocks
    maskedLine = maskedLine.replace(/\{\{INLINE_CODE_(\d+)}}/g, (match, index) => {
      return inlineCodeMatches[parseInt(index, 10)];
    });

    finalLines.push(maskedLine);
  }

  return finalLines.join("\n");
};

/**
 * Escapes HTML special characters inside quotes or backticks to prevent HTML injection.
 * - Converts special characters to their HTML entity equivalents.
 *
 * @param {string} html HTML string to be escaped.
 * @returns {string} Escaped HTML string.
 */
export const escapeHtml = (html: string): string => {
  // Regular expression to match single quotes, double quotes, and backticks
  const regex = /(['"`])(.*?)\1/g;

  // Replace function to escape the content inside quotes or backticks
  let escapedHtml = html.replace(regex, (match, p1, p2) => {
    const escapedContent = p2
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/`/g, "&#x60;"); // Escape backticks as &#x60;
    return `${p1}${escapedContent}${p1}`;
  });

  // Specifically replace <Image and <img tags
  escapedHtml = escapedHtml.replace(/<\/?Image/g, "&lt;Image");
  escapedHtml = escapedHtml.replace(/<\/?img/g, "&lt;img");

  return escapedHtml;
};

/**
 * Replaces markdown tables (that contain `|` and `_` characters) with table-related HTML elements.
 *
 * @param {string[]} lines Text containing markdown tables
 * @returns {string} Text with `<table>` and `<tbody>` HTML injected into it
 */
export const markdownTableToHTML = (lines: string[]): string => {
  if (lines.length < 2) return "";

  const headerCells = lines[0]
    .split("|")
    .map((cell) => parseInlineStyles(cell.trim()))
    .filter(Boolean);
  const bodyLines = lines.slice(2);

  const thead = `<thead><tr>${headerCells.map((c) => `<th>${c}</th>`).join("")}</tr></thead>`;

  const tbodyRows = bodyLines.map((row) => {
    const cells = row
      .split("|")
      .map((cell) => parseInlineStyles(cell.trim()))
      .filter(Boolean);
    return `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
  });

  const tbody = `<tbody>${tbodyRows.join("")}</tbody>`;

  return `<table class="md-table">\n${thead}\n${tbody}\n</table>`;
};

/**
 * Replaces special Unicode single quotes with a regular single quote.
 *
 * @param {string} text Text containing special single quotes.
 * @returns {string} Text with special single quotes replaced.
 */
export const replaceSpecialQuotes = (text: string): string => {
  const specialSingleQuotes = [
    "\u2018", // Left Single Quotation Mark (U+2018)
    "\u2019", // Right Single Quotation Mark (U+2019)
    "\u201A", // Single Low-9 Quotation Mark (U+201A)
    "\u2039", // Single Left-Pointing Angle Quotation Mark (U+2039)
    "\u203A", // Single Right-Pointing Angle Quotation Mark (U+203A)
  ];

  // Replace each special single quote with a regular single quote
  specialSingleQuotes.forEach((specialQuote) => {
    text = text.split(specialQuote).join("'");
  });

  return text;
};

/**
 * Parses inline styles in Markdown text into HTML.
 * - Handles inline code, images, links, bold, italic, and blockquotes.
 *
 * @param {string} text Markdown text to be parsed.
 * @returns {string} HTML string with inline styles converted.
 */
const parseInlineStyles = (text: string): string => {
  // Escape special Markdown characters inside inline code blocks
  text = text.replace(/`([^`]*)`/g, (match, code) => {
    const escapedCode = code
      .replace(/\*/g, "&#42;")
      .replace(/_/g, "&#95;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/＜/g, "&lt;")
      .replace(/＞/g, "&gt;")
      .replace(/\[/g, "&#91;")
      .replace(/\]/g, "&#93;")
      .replace(/\(/g, "&#40;")
      .replace(/\)/g, "&#41;");

    return `<span class="md-inline-code">${escapedCode}</span>`;
  });

  // Images
  text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');

  // Extract links and temporarily replace them with a placeholder
  const links: { placeholder: string; html: string }[] = [];
  let linkIndex = 0;
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
    const placeholder = `{{LINK~${linkIndex}}}`;
    links.push({ placeholder, html: `<a href="${url}">${linkText}</a>` });
    linkIndex++;
    return placeholder;
  });

  // Bold
  text = text.replace(/\*\*(?![^<]*?>)(.*?)\*\*/g, "<b>$1</b>");
  text = text.replace(/__(?![^<]*?>)(.*?)__/g, "<b>$1</b>");

  // Italic
  text = text.replace(/\*(?![^<]*?>)(.*?)\*/g, "<i>$1</i>");
  text = text.replace(/_(?![^<]*?>)(.*?)_/g, "<i>$1</i>");

  // Blockquotes
  text = text.replace(/^>\s*(.*)/gm, "<blockquote>$1</blockquote>");

  // Inline code
  text = text.replace(/`(.*?)`/g, `<span class="md-inline-code">$1</span>`);

  // Reinsert the links
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    text = text.replace(new RegExp(link.placeholder, "g"), link.html);
    // console.dir({ placeholder: link.placeholder, html: link.html });
  }

  // Remove backslash escape for * and _ outside of code
  text = text.replace(/\\([*_])/g, "$1");

  return text;
};

/**
 * Converts a Markdown string into an array of MarkdownElement objects.
 * - Handles headers, code blocks, unordered lists, and paragraphs.
 *
 * @param {string} markdown Markdown string to be parsed.
 * @returns {MarkdownElement[]} An array of MarkdownElement objects.
 */
export const parseMarkdown = (markdown: string): MarkdownElement[] => {
  if (typeof markdown !== "string" || !markdown) {
    throw new Error(`Markdown string is invalid: ${typeof markdown}`);
  }

  markdown = replaceReferenceLinks(markdown);
  const lines = stripLeadingWhitespace(markdown).split("\n");
  const totalYamlFrontLines = lines.filter((line) => line.trim() === "---").length;
  let yamlEndLine = -1;

  // Find closing YAML marker if it exists
  if (totalYamlFrontLines >= 2 && lines[0].trim() === "---") {
    for (let j = 1; j < lines.length; j++) {
      if (lines[j].trim() === "---") {
        yamlEndLine = j;
        break;
      }
    }
  }

  const processedLines: number[] = [];
  const elements: MarkdownElement[] = [];

  let i = 0;
  let inMetadata = false;
  while (i < lines.length) {
    const line = replaceSpecialQuotes(lines[i]).trim();

    // Skip YAML metadata block
    if (i === 0 && line === "---") {
      inMetadata = true;
      i++;
      continue;
    }

    // Detect end of YAML front matter
    if (line === "---" && inMetadata) {
      inMetadata = false;
      i++;
      continue;
    }

    if (inMetadata) {
      if (i === yamlEndLine) {
        inMetadata = false;
      }
      i++;
      continue;
    }

    // Decorative line: triple hyphen
    if (line.trim() === "---") {
      elements.push({ type: "line", content: "" });
      i++;
      continue;
    }

    // Handle Headers
    if (line.startsWith("##### ")) {
      elements.push({ type: "h5", content: parseInlineStyles(line.slice(5)) });
    } else if (line.startsWith("#### ")) {
      elements.push({ type: "h4", content: parseInlineStyles(line.slice(5)) });
    } else if (line.startsWith("### ")) {
      elements.push({ type: "h3", content: parseInlineStyles(line.slice(4)) });
    } else if (line.startsWith("## ")) {
      elements.push({ type: "h2", content: parseInlineStyles(line.slice(3)) });
    } else if (line.startsWith("# ")) {
      elements.push({ type: "h1", content: parseInlineStyles(line.slice(2)) });

      // Handle Code Blocks
    } else if (line.trimStart().startsWith("```")) {
      const cleanLine = line.trimStart();
      const language = cleanLine.slice(3).trim().toLowerCase() || "txt";
      const codeLines: string[] = [];

      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        const fixedLine = replaceSpecialQuotes(lines[i]);
        codeLines.push(fixedLine);
        i++;
      }

      const finalCode = codeLines.join("\n");
      elements.push({ type: "code", content: finalCode, language });

      // Handle Unordered Lists
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const listItems: string[] = [];

      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) {
        const parsedItem = parseInlineStyles(lines[i].trim().slice(2));
        listItems.push(`<li>${parsedItem}</li>`);
        i++;
      }
      elements.push({ type: "ul", content: listItems.join("") });
      continue; // Skip to next iteration to avoid re-processing the same line

      // Handle Paragraphs
    }

    // Handle Tables
    else if (line.includes("|") && i + 1 < lines.length && /^\s*\|?\s*-+/.test(lines[i + 1])) {
      const tableLines: string[] = [];

      // Capture header and separator rows
      tableLines.push(lines[i]);
      tableLines.push(lines[i + 1]);
      i += 2;

      // Capture remaining rows
      while (i < lines.length && lines[i].includes("|") && !lines[i].trim().startsWith("#") && lines[i].trim().length > 0) {
        tableLines.push(lines[i]);
        i++;
      }

      // Convert table to HTML
      const tableHtml = markdownTableToHTML(tableLines);
      elements.push({ type: "table", content: tableHtml });

      continue; // Skip to next iteration
    } else if (line.trim().length > 0) {
      const fixedLine = parseInlineStyles(line);
      // console.dir({ fixedLine });

      elements.push({ type: "p", content: fixedLine });
    }

    if (processedLines.includes(i)) {
      console.error(`\x1b[31mLine '${line}' (#${i}) has already been processed\x1b[37m`);
      break;
    }
    processedLines.push(i);

    i++;
  }

  return elements;
};

/**
 * Converts a MarkdownElement object to an HTML string.
 * - Handles different element types including headers, code blocks, tables, and lists.
 *
 * @param {MarkdownElement} element MarkdownElement object to be converted.
 * @returns {string} HTML representation of the MarkdownElement.
 */
export const elementToHtml = (element: MarkdownElement, addCopyToClipboard: boolean = true): string => {
  switch (element.type) {
    case "h1":
      return `<h1>${element.content}</h1>\n`;
    case "h2":
      return `<h2>${element.content}</h2>\n`;
    case "h3":
      return `<h3>${element.content}</h3>\n`;
    case "h4":
      return `<h4>${element.content}</h4>\n`;
    case "h5":
      return `<h5>${element.content}</h5>\n`;
    case "table":
      return `${element.content}\n`;
    case "line":
      return `<div class="md-line"></div>\n`; // i.e. `---` decorative lines
    case "code":
      let highlightedCode: string = "";
      if (element.language && typeof element.language === "string") {
        const codeBlock = element.content;
        const lines = codeBlock.split("\n");
        const multiLineCommentRegex: MultilineCommentRegex | null = getMultilineCommentRegex(element.language);
        const finalLines = [];

        let inBlockComment: boolean = false,
          pythonCommentIsOpen: boolean = false,
          isPython: boolean = !!(element.language === "py" || element.language === "python"),
          htmlCommentOpen = false,
          previousHtmlLang = "html";

        for (let i = 0; i < lines.length; i++) {
          let line = lines[i];
          // console.log(`\nline: '${line}'`);

          let isBlockStart = false,
            isBlockEnd = false;

          if (multiLineCommentRegex) {
            const startRegex = multiLineCommentRegex.start;
            const endRegex = multiLineCommentRegex.end;
            isBlockStart = startRegex.test(line);
            isBlockEnd = endRegex.test(line);
          }

          // console.dir({ isBlockStart, isBlockEnd });

          // Handle Python as a special case since opening/closing are the same
          if (isPython) {
            // Python `'''` and `"""` comments
            const regexPython = /('''|""")/;

            // Matches the start of a Python multiline comment (''' or """)
            const isPythonMultiCommentMarker = regexPython.test(line);

            if (isPythonMultiCommentMarker) {
              pythonCommentIsOpen = !pythonCommentIsOpen;
              if (pythonCommentIsOpen) {
                finalLines.push(`<span class="md-comment">${line}`);
              } else {
                finalLines.push(`${line}</span>`);
              }
            } else {
              if (pythonCommentIsOpen) {
                // Do not highlight anything if inside an open Python multi-line comment
                finalLines.push(line);
              } else {
                finalLines.push(`</span>${highlightCode(element.language as string, line)}`);
              }
            }
          }

          // All other languages
          else {
            if (element.language === "html") {
              if (line.trim() === "<!--") {
                line = line.replace(/<!--/g, `&lt;!--`);
                line = '<span class="md-comment">' + line; // Open md-comment <span>
                htmlCommentOpen = true;
              }

              const otherCodeResult = detectNonHtmlCodeBlocks(line, previousHtmlLang);

              if (previousHtmlLang !== "html" && otherCodeResult?.action === "inside") {
                console.log(`\n${line}`);
                console.dir({ otherCodeResult });
                console.dir({ htmlCommentOpen });
                highlightedCode = highlightCode(previousHtmlLang, line);
              } else if (!htmlCommentOpen) {
                highlightedCode = highlightCode("html", line);
              } else {
                // Close md-comment <span>
                highlightedCode = escapeHtml(line);

                if (htmlCommentOpen === true && line.includes("-->")) {
                  highlightedCode = escapeHtml(line);
                  htmlCommentOpen = false;
                  highlightedCode = highlightedCode + "</span>";
                }
              }

              // console.dir({ highlightedCode });
              previousHtmlLang = typeof otherCodeResult?.lang === "string" ? otherCodeResult.lang : "html";
              finalLines.push(highlightedCode);
            }

            // Handle opening the block comment
            else if (isBlockStart && !inBlockComment) {
              finalLines.push(`<span class="md-comment">${line}`);
              inBlockComment = true;
            }

            // If we're still inside a block comment
            else if (inBlockComment && !isBlockStart && !isBlockEnd) {
              finalLines.push(line);
            }

            // Close the md-comment span for multi-line comments
            else if (inBlockComment && isBlockEnd) {
              finalLines.push(`${line}</span>`);
              inBlockComment = false;
            }

            // Regular code highlighting for non-block comment lines
            else {
              highlightedCode = highlightCode(element.language as string, line);
              finalLines.push(highlightedCode); // Push highlighted code only if not in block comment

              // Handle Tables
              if (line.includes("|") && i + 1 < lines.length && /^\s*\|?\s*-+/.test(lines[i + 1])) {
                const tableLines: string[] = [];

                // Capture header and separator rows
                tableLines.push(lines[i]);
                tableLines.push(lines[i + 1]);
                i += 2;

                // Capture remaining rows
                while (i < lines.length && lines[i].includes("|") && !lines[i].trim().startsWith("#") && lines[i].trim().length > 0) {
                  tableLines.push(lines[i]);
                  i++;
                }

                continue; // Skip to next iteration
              }
            }
          }
        }

        highlightedCode = finalLines.join("\n");
      }

      return `
          <div class="md-code-container">
            ${addCopyToClipboard ? `<button onclick="copyToClipboard(this)">Copy</button>` : ""}
            <pre><code class="md-code${element.language ? "-" + element.language : ""}">${escapeHtml(highlightedCode)}</code></pre>
          </div>
        `;

    case "ul":
      return `<ul>\n${element.content}\n</ul>\n`;
    case "ol":
      return `<ol>\n${element.content}\n</ol>\n`;
    case "li":
      return `<li>${escapeHtml(element.content)}</li>\n`;
    case "p":
      return `<p>${parseInlineStyles(element.content as string)}</p>\n`;
    default:
      return "";
  }
};

// Add the global script for copy-to-clipboard functionality
export const globalScript = (): string => `
  <script>
    function copyToClipboard(button) {
      const codeBlock = button.parentElement.querySelector('code');
      const text = codeBlock.innerText.replace(/＜/g, '<').replace(/＞/g, '>');
      navigator.clipboard.writeText(text).then(() => {
        button.innerText = 'Copied!';
        setTimeout(() => button.innerText = 'Copy', 2000);
      });
    }
  </script>
`;
