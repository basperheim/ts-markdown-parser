import { highlightCode, Language } from "./libs/index";

type MarkdownElement = {
  type: string;
  content: string;
  language?: string;
};

export function markdownToHtml(markdown: string): string {
  const elements = parseMarkdown(markdown);
  console.dir({ elements });
  return elements.map(elementToHtml).join("");
}

function parseMarkdown(markdown: string): MarkdownElement[] {
  const lines = markdown.split("\n");
  const elements: MarkdownElement[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("#### ")) {
      elements.push({ type: "h4", content: line.slice(5) });
    } else if (line.startsWith("### ")) {
      elements.push({ type: "h3", content: line.slice(4) });
    } else if (line.startsWith("## ")) {
      elements.push({ type: "h2", content: line.slice(3) });
    } else if (line.startsWith("# ")) {
      elements.push({ type: "h1", content: line.slice(2) });
    } else if (line.startsWith("```")) {
      const language = line.slice(3).toLowerCase();
      const codeLines: string[] = [];

      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push({ type: "code", content: codeLines.join("\n"), language });
    } else {
      elements.push({ type: "p", content: line });
    }

    i++;
  }

  return elements;
}

function elementToHtml(element: MarkdownElement): string {
  switch (element.type) {
    case "h1":
      return `<h1>${element.content}</h1>`;
    case "h2":
      return `<h2>${element.content}</h2>`;
    case "h3":
      return `<h3>${element.content}</h3>`;
    case "code":
      if (element.language && Object.values(Language).includes(element.language as Language)) {
        const lines = element.content.split("\n");
        const highlightedLines = lines.map((line) => highlightCode(element.language as Language, line));
        const highlightedCode = highlightedLines.join("\n");
        return `<pre><code class="code-${element.language}">${escapeHtml(highlightedCode)}</code></pre>`;
      } else {
        // Fallback if language is not specified or invalid
        return `<pre><code>${escapeHtml(element.content)}</code></pre>`;
      }
    case "p":
      return `<p>${escapeHtml(element.content as string)}</p>`;
    default:
      return "";
  }
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
