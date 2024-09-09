import { MarkdownElement } from "../models";
import { highlightCode, stripLeadingWhitespace, countOccurrences } from "../libs";

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

  // Handle links after escaping
  // escapedHtml = escapedHtml.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  return escapedHtml;
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
    const placeholder = `{{LINK_${linkIndex}}}`;
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
  links.forEach((link) => {
    text = text.replace(link.placeholder, link.html);
  });

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

  const lines = stripLeadingWhitespace(markdown).split("\n");
  const processedLines: number[] = [];
  const elements: MarkdownElement[] = [];
  let i = 0;

  const totalYamlFrontLines = countOccurrences(lines, "---");
  let inMetadata = false;
  while (i < lines.length) {
    const line = replaceSpecialQuotes(lines[i]).trim();

    if (totalYamlFrontLines >= 2) {
      // Detect start of YAML front matter
      if (line === "---" && i === 0) {
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
        i++;
        continue; // Skip processing of lines inside metadata block
      }
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
    } else if (line.startsWith("```")) {
      const language = line.slice(3).toLowerCase();
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
    } else if (line.trim().length > 0) {
      elements.push({ type: "p", content: parseInlineStyles(line) });
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
 * - Handles different element types including headers, code blocks, and lists.
 *
 * @param {MarkdownElement} element MarkdownElement object to be converted.
 * @returns {string} HTML representation of the MarkdownElement.
 */
export const elementToHtml = (element: MarkdownElement): string => {
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
    case "code":
      if (element.language && typeof element.language === "string") {
        const lines = element.content.split("\n");
        const highlightedLines = lines.map((line) => highlightCode(element.language as string, line));
        let highlightedCode = highlightedLines.join("\n");

        // Handle JavaScript/TypeScript block comments
        const jsCommentLangs = ["ts", "js", "javascript", "typescript"];
        if (jsCommentLangs.includes(element.language)) {
          const blockCommentRegex = /\/\*([\s\S]*?)\*\//gm;
          highlightedCode = highlightedCode.replace(blockCommentRegex, `<span class="md-comment">&sol;&ast;$1&ast;&sol;</span>`);
        }

        // Handle Python block comments
        const pythonCommentLangs = ["py", "python"];
        if (pythonCommentLangs.includes(element.language)) {
          const pyCommentRegex = /"""([\s\S]*?)"""/gm;
          if (pyCommentRegex.test(highlightedCode)) {
            const pyComment = `<span class="md-comment">&quot;&quot;&quot;$1&quot;&quot;&quot;</span>`;
            highlightedCode = highlightedCode.replace(pyCommentRegex, pyComment);
          }
        }

        return `
          <div class="md-code-container">
            <button onclick="copyToClipboard(this)">Copy</button>
            <pre><code class="md-code-${element.language}">${escapeHtml(highlightedCode)}</code></pre>
          </div>
        `;
      } else {
        return `
          <div class="md-code-container">
            <button onclick="copyToClipboard(this)">Copy</button>
            <pre><code class="md-code">${escapeHtml(element.content)}</code></pre>
          </div>
        `;
      }
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
      navigator.clipboard.writeText(codeBlock.innerText).then(() => {
        button.innerText = 'Copied!';
        setTimeout(() => button.innerText = 'Copy', 2000);
      });
    }
  </script>
`;
