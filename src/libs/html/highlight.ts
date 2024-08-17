import { escapeHtml } from "../../utils/helpers";

export const highlightHtml2 = (code: string): string => {
  // Escape HTML content to prevent it from being rendered as actual HTML
  let highlighted = escapeHtml(code);

  // Regex to match strings (attribute values), ignoring double quotes inside class attributes
  const stringRegex = /(["'])(.*?)(\1)/g;
  highlighted = highlighted.replace(stringRegex, '<span class="md-string">$1$2$3</span>');

  // Regex to match HTML comments
  const commentRegex = /(&lt;!--[\s\S]*?--&gt;)/g;
  highlighted = highlighted.replace(commentRegex, '<span class="md-comment">$&</span>');

  // Function to highlight HTML tags and attributes
  const replaceTagsAndAttributes = (text: string): string => {
    return text.replace(/(&lt;\/?)(\w+)(.*?)(\/?&gt;)/g, (match, openingTag, tagName, attributes, closingTag) => {
      // Highlight tag name
      let result = `${openingTag}<span class="md-keyword">${tagName}</span>`;

      // Highlight attributes
      if (attributes) {
        result += attributes.replace(/(\b\w+\b)(=)/g, '<span class="md-attribute">$1</span>$2');
      }

      return `${result}${closingTag}`;
    });
  };

  // Apply tag and attribute highlighting
  highlighted = replaceTagsAndAttributes(highlighted);

  return highlighted;
};

export const highlightHtml = (code: string): string => {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/`/g, "&#x60;"); // Escape backticks as &#x60;
};
