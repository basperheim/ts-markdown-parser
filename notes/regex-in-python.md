# RegExp in Python

Python handles regular expressions a bit differently compared to JavaScript or TypeScript, particularly in how strings are processed and used in regular expressions. Here’s a comparison:

### Python Regular Expressions

1. **Raw Strings for Regex**:

- In Python, regular expressions are often written using raw strings (prefix `r`). This is because raw strings treat backslashes as literal characters and avoid issues with double escaping.
- Example: `r'\d{3}-\d{2}-\d{4}'` is a raw string where backslashes are not treated as escape characters.

2. **String Representation**:

- Regular expressions in Python are always defined as strings. You don’t have regex literals like in JavaScript.
- Example: `re.compile(r'\d{3}-\d{2}-\d{4}')`

3. **Regex Functions**:

- Python uses the `re` module for regex operations. Functions such as `re.match()`, `re.search()`, `re.findall()`, and `re.sub()` are used for pattern matching and substitution.
- Example: `re.findall(r'\d+', '123 abc 456')` returns `['123', '456']`.

### JavaScript/TypeScript Regular Expressions

1. **Regex Literals**:

- In JavaScript and TypeScript, you can define regular expressions using regex literals enclosed in slashes.
- Example: `/\d{3}-\d{2}-\d{4}/`

2. **String Representation**:

- You can also use the `RegExp` constructor to create regexes from strings, which allows for dynamic patterns.
- Example: `new RegExp('\\d{3}-\\d{2}-\\d{4}')`

3. **Regex Functions**:

- JavaScript provides methods like `.match()`, `.replace()`, `.test()`, and `.exec()` for regex operations on strings.
- Example: `'123 abc 456'.match(/\d+/g)` returns `['123', '456']`.

### Conclusion

In Python:

- Use raw strings to simplify regex writing.
- Treat regex patterns as strings in Python functions.

In JavaScript/TypeScript:

- Use regex literals or the `RegExp` constructor.
- Highlighting might need to be more nuanced if dealing with different regex notations or usage scenarios.
