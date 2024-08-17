# Sample Markdown Article

## Introduction

This is an example of a sample Markdown article with various elements for testing purposes.

Here is an [example link](https://example.com) with some **bold text** and _italic text_.

## Ordered List

1. First item
2. Second item
3. Third item

### Another Ordered List

- First item
- Second item
- Third item with inline `<html>` element

### More Details

Here is a nested `<span>` inside a paragraph. Below is a code block:

```html
<div class="container">
  <span>This is a span element</span>
  <span class="special">This is a special span</span>
</div>
```

And another `<span>` inline example in a paragraph.

#### Code Block with Inline Span

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sample HTML Article</title>
  </head>
  <body>
    <h1>Sample HTML Article</h1>
    <p>This is an example of a <span class="example">sample HTML</span> article.</p>
    <a href="https://example.com">Link</a>
    <strong>Bold Text</strong> and <em>Italic Text</em>
    <pre><code><span class="hello">Hello</span></code></pre>
  </body>
</html>
```

#### Final Thoughts

This Markdown content includes a variety of elements for testing. You can see how different Markdown elements render and how code blocks handle HTML tags with `<span>` elements.

### Explanation

- **Headers**: The Markdown file includes headers from `#` to `####` for various levels of headings.
- **Ordered List**: An ordered list with three items.
- **Links and Text Styles**: An [example link](https://example.com) (Just do `[example link](https://example.com)`), bold (`**bold text**`), and italic (`*italic text*`) text.
- **Links and Text Styles Again!**: Another example bold (`__bold text__`), and italic (`_italic text_`) text.
- **Inline Span Examples**: Inline `<span>` elements in both Markdown text and code blocks.
- **Code Blocks**: Includes HTML code blocks with `<span>` elements to test highlighting and parsing.

This Markdown example will help you check how your parser deals with different types of content and ensure it handles `<span>` elements appropriately.
