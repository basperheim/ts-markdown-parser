### Code Block without Language Specification

#### My Article

Markdown refs can be used like `[n]: https://example.com "Some Title"`, and then you annotate that to `[Some reference][n]`

```
This is a code block without a language specification.
It should be treated as a txt code block.
```

This discusses dopamine circuits ([Dopamine Info](https://dopamine.org)) and neuroplasticity ([Neuroplasticity Study](https://pmc.ncbi.nlm.nih.gov/articles/PMC1234567)).

### Example Code Block With Annotations

```js
// This should NOT be processed as a real annotation
console.log("[test link][1]");
console.log("[2]: https://fakeurl.com 'Should stay literal'");
```

Further reading ([Wikipedia Brain](https://en.wikipedia.org/wiki/Brain)).

### Internal Reference Links

[Test][1]

[1]: https://www.example.com "Example"

This should be replaced with a link to https://www.example.com

### Triple Hyphen Line

---

This should be replaced with a div element and a horizontal line.

### More Markdown

This is a [test link][2].

[2]: https://www.example.com/test "test link ref"

### Code Block with Language Specification

```javascript
console.log("Hello World!");
```

### Another Code Block

```
This is another code block.
```

### Internal Reference Link with Number

This is a [test link][3].

[3]: https://www.example.com/test "test link reference"

```

This markdown example covers:

* A code block without a language specification
* An internal reference link with a numeric annotation
* A triple hyphen line
* A code block with a language specification
* Another code block without a language specification
* Another internal reference link with a numeric annotation

```
