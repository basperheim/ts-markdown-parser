export const markdownToHtml = (markdown: string): string => {
  // Basic parsing logic
  const lines = markdown.split("\n");
  let html = "";

  for (const line of lines) {
    if (line.startsWith("```")) {
      // Handle code blocks
      html += `<pre><code>${line.slice(3)}</code></pre>`;
    } else if (line.startsWith("# ")) {
      // Handle headings
      html += `<h1>${line.slice(2)}</h1>`;
    } else if (line.startsWith("## ")) {
      html += `<h2>${line.slice(3)}</h2>`;
    } else {
      // Handle paragraphs
      html += `<p>${line}</p>`;
    }
  }

  return html;
};
