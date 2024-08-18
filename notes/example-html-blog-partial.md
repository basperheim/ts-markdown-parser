# Introduction to Go

Go, also known as Golang, is a statically typed, compiled programming language designed by Google. It's known for its simplicity, efficiency, and strong support for concurrency.

## Key Features

- **Simplicity**: Go’s syntax is clean and easy to understand, making it a great language for beginners and experienced developers alike.
- **Concurrency**: Go has built-in support for concurrent programming with goroutines and channels, which makes it easier to write programs that can handle multiple tasks at once.
- **Performance**: As a compiled language, Go offers high performance and efficiency, which is useful for building scalable and fast applications.

## Basic Syntax

Here's a simple Go program that prints "Hello, World!" to the console:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

## Variables and Types

In Go, you can declare variables using the `var` keyword:

```go
var name string = "Go"
var age int = 10
```

Alternatively, Go supports type inference:

```go
name := "Go"
age := 10
```

## Control Structures

Go includes standard control structures such as `if`, `for`, and `switch`. Here's an example of a `for` loop:

```go
for i := 0; i < 5; i++ {
    fmt.Println(i)
}
```

### Conclusion

Go is a powerful language that combines simplicity with advanced features like concurrency. Its efficiency and ease of use make it a popular choice for a variety of applications, from web servers to distributed systems.

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

<span class="hello">Hello</span>

## Basics of Python

Python is known for its simplicity and readability. Here are some basic concepts:

1. **Variables and Data Types**

   - Variables are used to store data.
   - Python supports various data types like integers, floats, strings, and booleans.

2. **Control Flow**

   - Python uses `if`, `elif`, and `else` statements for conditional execution.

3. **Loops**
   - You can use `for` and `while` loops to iterate over sequences and perform repetitive tasks.

## Python Code Examples

### Example 1: Hello World

This is a simple example of printing "Hello, World!" in Python.

```py
print("Hello, World!")
```

### Example 2: Basic Calculator

Here’s a basic calculator that performs addition, subtraction, multiplication, and division.

```python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Cannot divide by zero!"
    return a / b

print(add(5, 3))
print(subtract(10, 4))
print(multiply(2, 7))
print(divide(9, 3))
```
