# Test Markdown Article

Below is an example of Markdown that includes various headers, lists, and code blocks for each of the specified languages, including block comments with actual code inside. This will help you verify that the block comments are not being highlighted while ensuring that regular code outside the comments is highlighted correctly.

## Example Markdown

- List 1
- List 2

1. Numbered item
2. Another numbered item

Here's a [link](example.com) to another site.

Here's an example codeblock of a `doesnotexist` (`&#96;&#96;&#96;doesnotexist`) language that does not exist:

```doesnotexist
var madeUp: num = 1234; // this lang does not exist
```

## HTML Test

Here's some example HTML code in an `&#x60;&#x60;&#x60;html` block:

```html
<!DOCTYPE html>
<h1 class="my-heading" style="color:red">Heading</h1>
<a href="https://example.com">Link</a>
<span class="hello">Hello</span>
<p>Hello</p>
<!-- this is a comment
 with multiple lines
 -->
```

Here's a simple Go program that prints "Hello, World!" to the console:

```go
package main

import "fmt"

// a = 1233

/*
a = 1223
*/
func main() {
    // A comment!
    fmt.Println("Hello, World!")
}
```

## JavaScript Example

Here's an example of JavaScript with a block comment:

```javascript
/**
 * This is a block comment
 * with multiple lines.
 * const a = "DO NOT HIGHLIGHT THIS";
 */
const greeting = "Hello, World!";
console.log(greeting); // This should be highlighted
```

Some mo' JavaScript:

```js
/**
 * This is a block comment
 * with multiple lines.
 * const a = "DO NOT HIGHLIGHT THIS";
 */
const greeting = "Hello, World!";
console.log(greeting); // This should be highlighted

/*
DO NOT HIGHLIGHT THIS
const a = "DO NOT HIGHLIGHT THIS";
*/
```

## TypeScript Example

TypeScript example with a block comment:

```typescript
/**
 * Block comment in TypeScript
 * This function adds two numbers.
 */
function add(a: number, b: number): number {
  return a + b; // This should be highlighted
}
```

## Python Example

Python example with a block comment:

```python
"""
This is a block comment in Python
with some code that should not be highlighted:
a = 123
print(a)
"""

x = 5
print(x) # This should be highlighted, but not this comment part
```

```py
"""
Another block comment in Python
"""
y = 10
print(y)  # This should also be highlighted

def my_func(a, b):
  '''
  This describes a Python function
  '''
  return a + b

my_func(1, 2)
```

## HTML Example

HTML example with a block comment:

```html
<!--
This is an HTML comment
It should not highlight this line.
-->
<div>Hello, HTML!</div>
<!-- This should NOT be highlighted -->
```

## CSS Example

CSS example with a block comment:

```css
/*
This is a CSS comment
It should not highlight this property.
*/
body {
  background-color: #f0f0f0; /* This should be commented out <span>HELLO</span> */
}
```

## Go Example

Go example with a block comment:

```go
/*
This is a block comment in Go
Here's some code that should not be highlighted:
var a str = "dasddad"
*/
func main() {
    fmt.Println("var age int") // This should be commented out
}
```

## SQL Example

SQL example with a block comment:

```sql
/*
This is a SQL comment
It should not highlight this query.
*/
SELECT * FROM users; -- This should be commented out
```

## Lua Example

Lua example with a block comment:

```lua
--[[
This is a block comment in Lua
This should not be highlighted.
]]
print("Hello, Lua; local test = 'abcd'") -- This should be commented out
```

### Key Points:

- Each code block contains a block comment that spans multiple lines and includes code within it.
- After the block comments, there are also lines of code that should be highlighted normally.
- The structure includes various Markdown elements such as headers and lists to represent a more comprehensive document.

### Testing:

When you run this through your Markdown-to-HTML conversion logic, you can verify that:

1. The content inside the block comments is not highlighted.
2. The code outside of the block comments is correctly highlighted.
3. The overall Markdown structure (headers, lists, etc.) is rendered properly in the output HTML.

Feel free to run this example and let me know if you need further adjustments or additional scenarios!
