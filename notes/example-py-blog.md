# Introduction to Python

Python is a versatile programming language that is widely used in various fields, including web development, data science, artificial intelligence, and more. This article covers some fundamental aspects of Python.

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

## Common Python Pitfalls

1. **Indentation Errors**

   - Python relies on indentation to define code blocks. Be consistent with your indentation.

2. **Mutable Default Arguments**
   - Be cautious when using mutable objects as default arguments in functions.

## Summary

Python is a powerful language with a clear and simple syntax. Whether you are a beginner or an experienced developer, Python offers a rich set of features for different programming needs.

**Happy coding!** Remember, practice is key to mastering Python.

_For more details, check the [official Python documentation](https://docs.python.org/3/)._
