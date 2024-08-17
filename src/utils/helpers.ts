import { MarkdownElement, Language, LanguageType } from "../models";
import { highlightCode } from "../libs";

// Function to get comment regex based on language
const getCommentRegex = (language: LanguageType) => {
  switch (language) {
    case "javascript":
    case "js":
      return /(\/\/.*|\/\*[\s\S]*?\*\/)/g; // Single and multi-line comments
    case "python":
    case "py":
      return /(#.*|""".*?""")/gs; // Single and multi-line comments
    case "html":
      return /(&lt;!--.*?--&gt;)/g; // HTML comments
    default:
      return null;
  }
};

export const escapeHtml = (html: string): string => {
  // Regular expression to match single quotes, double quotes, and backticks
  const regex = /(['"`])(.*?)\1/g;
  // const commentRegex = language ? getCommentRegex(language) : null;

  // Replace function to escape the content inside quotes or backticks
  const escapedHtml = html.replace(regex, (match, p1, p2) => {
    const escapedContent = p2
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/`/g, "&#x60;"); // Escape backticks as &#x60;
    return `${p1}${escapedContent}${p1}`;
  });

  return escapedHtml;
};

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

// Function to handle inline styles like bold and italic
const parseInlineStyles = (text: string): string => {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  text = text.replace(/__(.*?)__/g, "<b>$1</b>");

  // Italic
  text = text.replace(/\*(.*?)\*/g, "<i>$1</i>");
  text = text.replace(/_(.*?)_/g, "<i>$1</i>");

  // Inline code
  text = text.replace(/`(.*?)`/g, `<span class="md-inline-code">$1</span>`);

  return text;
};

export const parseMarkdown = (markdown: string): MarkdownElement[] => {
  const lines = markdown.split("\n");
  const elements: MarkdownElement[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = replaceSpecialQuotes(lines[i]).trim();

    // Handle Headers
    if (line.startsWith("#### ")) {
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
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        listItems.push(`<li>${parseInlineStyles(lines[i].slice(2))}</li>`);
        i++;
      }
      elements.push({ type: "ul", content: listItems.join("") });
      i--; // Adjust because the while loop increments i

      // Handle Paragraphs
    } else if (line.trim().length > 0) {
      elements.push({ type: "p", content: parseInlineStyles(line) });
    }

    i++;
  }

  return elements;
};

export const elementToHtml = (element: MarkdownElement): string => {
  switch (element.type) {
    case "h1":
      return `<h1>${element.content}</h1>\n`;
    case "h2":
      return `<h2>${element.content}</h2>\n`;
    case "h3":
      return `<h3>${element.content}</h3>\n`;
    case "code":
      if (element.language && Object.values(Language).includes(element.language as LanguageType)) {
        const lines = element.content.split("\n");
        const highlightedLines = lines.map((line) => highlightCode(element.language as LanguageType, line));
        const highlightedCode = highlightedLines.join("\n");

        const copyButton = `
          <div class="md-code-container">
            <button onclick="copyToClipboard(this)">Copy</button>
            <pre><code class="md-code-${element.language}">${escapeHtml(highlightedCode)}</code></pre>
          </div>
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

        return `${copyButton}\n`;
      } else {
        const copyButton = `
          <div class="md-code-container">
            <button onclick="copyToClipboard(this)">Copy</button>
            <pre><code class="md-code">${escapeHtml(element.content)}</code></pre>
          </div>
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

        return `${copyButton}\n`;
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
