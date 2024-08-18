# JavaScript Basics: Understanding the Fundamentals

## Introduction

JavaScript is a versatile and widely-used programming language. In this blog post, we'll explore some fundamental concepts of JavaScript that every developer should know.

### Variables and Data Types

JavaScript allows you to declare variables using `var`, `let`, and `const`. Here’s a quick overview:

- `var` is function-scoped and can be redeclared.
- `let` is block-scoped and cannot be redeclared within the same block.
- `const` is also block-scoped but cannot be reassigned.

### Example Code

```js
// Declaring variables
let name = "John Doe";
const age = 30;

// Logging to the console
console.log("Name:", name);
console.log("Age:", age);
```

### Functions

Functions are a core part of JavaScript. They can be defined in various ways:

1. **Function Declarations**:

```js
function greet(name) {
  return `Hello, ${name}!`;
}
```

2. **Function Expressions**:

```js
const greet = function (name) {
  return `Hello, ${name}!`;
};
```

3. **Arrow Functions**:

```js
const greet = (name) => `Hello, ${name}!`;
```

## Working with Arrays

Arrays are used to store multiple values in a single variable. You can manipulate arrays with various methods.

### Array Methods

- **push()** - Adds an item to the end of the array.
- **pop()** - Removes the last item from the array.
- **shift()** - Removes the first item from the array.
- **unshift()** - Adds an item to the beginning of the array.

### Example Code

```js
let fruits = ["Apple", "Banana", "Cherry"];

// Adding a fruit
fruits.push("Date");

// Removing the last fruit
fruits.pop();

// Displaying the array
console.log(fruits);
```

### More Code Examples

Here are some JavaScript code snippets that you can use for thorough testing. These examples include a mix of function calls, comments, string literals, reserved keywords, and different formatting styles.

#### JavaScript Code Examples

Some `&#x60;&#x60;&#x60;js` examples.

##### Example #1

```js
// Example 1: Basic Function Call
function greet(name) {
  return `Hello, ${name}`;
}

console.log(greet("World")); // Outputs: Hello, World
```

##### Example #2

```js
// Example 2: Method Calls and Object Literals
const person = {
  name: "John Doe",
  age: 30,
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  },
  setAge(newAge) {
    this.age = newAge;
  },
};

person.greet(); // Calls the greet method
person.setAge(31); // Calls the setAge method
```

##### Example #3

```js
/* Example 3: Multi-line Comment and String Literals */
const message = `This is a multi-line
string literal`;

const url = "https://example.com";

// Function call with multi-line string
function fetchData() {
  /* This function fetches data from the provided URL
       and logs the response */
  console.log("Fetching data from", url);
  // Simulate fetch
}
fetchData();
```

##### Example #4

```js
// Example 4: Arrow Functions and Class Methods
class Calculator {
  constructor() {
    this.result = 0;
  }

  add = (a, b) => {
    this.result = a + b;
    return this.result;
  };

  subtract(a, b) {
    this.result = a - b;
    return this.result;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3)); // Outputs: 8
console.log(calc.subtract(10, 4)); // Outputs: 6
```

##### Example #5

```js
// Example 5: Using Reserved Keywords and Template Literals
const if = true; // Reserved keyword
const while = () => { // Reserved keyword
    return `This is a template literal with reserved keywords`;
}

const result = while();
console.log(result); // Outputs: This is a template literal with reserved keywords
```

##### Example #6

```js
// Example 6: Functions with Different Parameter Types
function processData(data, callback) {
  if (typeof data === "string") {
    console.log(`Processing string data: ${data}`);
  } else if (Array.isArray(data)) {
    console.log(`Processing array data: ${data.join(", ")}`);
  }

  // Call the provided callback function
  callback();
}

processData("Hello World", () => console.log("Callback executed!"));
processData([1, 2, 3, 4], () => console.log("Array processed!"));
```

##### Example #7

```js
// Example 7: Complex Nested Function Calls
function outerFunction() {
  function innerFunction(a, b) {
    return a * b;
  }

  const result = innerFunction(5, 10);
  console.log(result); // Outputs: 50
}

outerFunction();
```

##### Example #8

```js
const code = `
class Calculator:
    def __init__(self):
        pass
`;

// Correct regex for class declarations
const classDeclareRegex = /^class\s+([A-Z][a-zA-Z0-9_]*)/gi;
const newClassDeclaration = code.replace(classDeclareRegex, "class AnotherCalculator");
console.log(newClassDeclaration);
```

Feel free to use these examples to test how your highlighting logic handles different JavaScript constructs, including function calls, method calls, reserved keywords, and various types of comments and strings.

#### Decorator Examples

Here are some TypeScript ORM code examples with decorators, presented in markdown format. Each block starts with an `#####` header to describe the example.

##### Basic Entity Decorator

```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
```

##### Decorator with Validation

```ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { IsEmail, Length } from "class-validator";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(1, 100)
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

##### Decorators for Relations

```ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}
```

##### Using `@OneToMany` Decorator

```ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";

/*
  Multi-line
  Comment
*/

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
```

##### Complex Decorators with Options

```ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

##### Decorator with Custom Naming Strategy

```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "product_name" })
  name: string;

  @Column({ name: "product_price", type: "decimal", precision: 10, scale: 2 })
  price: number;
}
```

##### Embedding Entities with Decorators

```ts
import { Entity, PrimaryGeneratedColumn, Column, Embedded } from "typeorm";

/**
 * My Special Class
 **/
class Address {
  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  country: string;
}

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Embedded(() => Address)
  address: Address;
}
```

##### Custom Decorators for Soft Deletes

```ts
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from "typeorm";

@Entity()
export class Archive {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
```

##### Using `@Generated` Decorator

```ts
import { Entity, PrimaryGeneratedColumn, Column, Generated } from "typeorm";

@Entity()
export class Identifier {
  @PrimaryGeneratedColumn()
  @Generated("uuid")
  id: string;

  @Column()
  value: string;
}
```

##### Decorators with Relationships and Custom Options

```ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "./Category";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: "category_id" })
  category: Category;
}
```

These examples illustrate various ways decorators are used in TypeScript ORM setups, highlighting different use cases and configurations.

## RegExp Examples

Here are some JavaScript code examples showcasing various uses of regex, including inline regex usage and different ways to apply regex patterns.

### Markdown with JavaScript Regex Examples

##### Simple Regex Pattern

```js
const pattern = /abc/;
const str = "abc";
console.log(pattern.test(str)); // true
```

##### Regex with Flags

```js
const pattern = /abc/i; // case-insensitive
const str = "ABC";
console.log(pattern.test(str)); // true
```

##### Regex with Global Flag

```js
const pattern = /abc/g;
const str = "abc abc";
const matches = str.match(pattern);
console.log(matches); // ["abc", "abc"]
```

##### Regex with Multiple Flags

```js
const pattern = /abc/giu;
const str = "ABC";
console.log(pattern.test(str)); // true
```

##### Inline Regex in String Replacement

```js
const str = "hello world";
const newStr = str.replace(/world/, "JavaScript");
console.log(newStr); // "hello JavaScript"
```

##### Regex in Conditional Statements

The `/w+/` RegExp is used for matching words, and the `test()` method is used to "test" strings for a match, which is great for conditional blocks:

```js
const str = "hello123";
if (/^\w+\d+$/.test(str)) {
  console.log("String contains letters followed by digits.");
}
```

##### Regex with Character Classes

```js
const pattern = /[A-Za-z0-9]/;
const str = "abc123";
const result = str.match(pattern);
console.log(result); // ["a"]
```

##### Regex with Group Capturing

```js
const pattern = /(\d+)/;
const str = "Price: 100";
const match = str.match(pattern);
console.log(match[1]); // "100"
```

##### Regex for Validation

```js
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const email = "example@domain.com";
console.log(emailPattern.test(email)); // true
```

##### Inline Regex in Template Literals

```js
const str = `The quick brown fox jumps over the lazy dog.`;
const pattern = /quick\s(brown)\s(fox)/;
const newStr = str.replace(pattern, "swift $1 $2");
console.log(newStr); // "The swift brown fox jumps over the lazy dog."
```

##### Regex in Function Parameters

```js
function highlightText(text, pattern) {
  return text.replace(pattern, "<mark>$&</mark>");
}
const result = highlightText("Here is some text", /some text/);
console.log(result); // "Here is <mark>some text</mark>"
```

Feel free to test these examples and adjust as needed for your highlighting functionality!

## Conclusion

JavaScript is a powerful language with many features. Understanding variables, functions, and arrays is crucial for any developer. Keep practicing and exploring more advanced topics to become proficient.
