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
# This is a basic comment
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

### More Code Examples

Here are 10 different Python code block examples, each with a description in Markdown format:

##### Simple Function Definition

```py
def greet(name):
    return f"Hello, {name}!"
```

##### Function with Default Arguments

```py
def multiply(a, b=1):
    return a * b
```

##### Function with Variable-Length Arguments

```py
def add_numbers(*args):
    return sum(args)
```

##### Function with Keyword Arguments

```py
def describe_person(name, **kwargs):
    description = f"Name: {name}"
    for key, value in kwargs.items():
        description += f", {key}: {value}"
    return description
```

##### Method in a Class

```py
class Calculator:
    def add(self, a, b):
        return a + b

    def subtract(self, a, b):
        return a - b
```

##### Method with Decorator

```py
def decorator(func):
    def wrapper(*args, **kwargs):
        print("Calling function")
        return func(*args, **kwargs)
    return wrapper

@decorator
def say_hello():
    print("Hello!")
```

##### Lambda Function

```py
square = lambda x: x * x
print(square(5))
```

##### Function with List Comprehension

```py
def squares(numbers):
    return [x * x for x in numbers]
```

##### Function Call with Arguments

```py
def divide(a, b):
    return a / b

result = divide(10, 2)
```

##### Function with Exception Handling

```py
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Cannot divide by zero!"
```

### RegExp Python Examples

Sure! Here are some Python code block examples with various RegExp patterns, including inline regex in comments and code, to help you test your highlighting function:

##### Example 1: Basic Regex

```python
import re

pattern = r'\d+' # Matches one or more digits
text = 'There are 123 apples'
result = re.findall(pattern, text)
print(result)
```

##### Example 2: Regex with Flags

```python
import re

pattern = re.compile(r'[a-z]+', re.IGNORECASE) # Case-insensitive match
text = 'Hello World'
result = pattern.findall(text)
print(result)
```

##### Example 3: Regex with Comments

```python
import re

# Pattern to match phone numbers: (123) 456-7890
pattern = re.compile(r'\(\d{3}\) \d{3}-\d{4}')
text = 'Call me at (123) 456-7890'
result = pattern.findall(text)
print(result)
```

##### Example 4: Triple Quotes and Regex

```python
import re

"""
Multiline regex pattern to match email addresses:
Example: user@example.com
"""
pattern = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
text = 'Contact: user@example.com'
result = pattern.findall(text)
print(result)
```

##### Example 5: Regex with Grouping

```python
import re

pattern = r'(\d{3})-(\d{2})-(\d{4})' # Matches SSNs like 123-45-6789
text = 'My SSN is 123-45-6789'
result = re.match(pattern, text)
print(result.groups())
```

##### Example 6: Regex in Function Call

```python
import re

def search_dates(text):
    pattern = r'\d{4}-\d{2}-\d{2}' # Matches dates like 2024-08-17
    return re.findall(pattern, text)

text = 'Dates: 2024-08-17 and 2024-12-25'
print(search_dates(text))
```

##### Example 7: Regex in Class Declaration

```python
import re

class RegexHelper:
    def __init__(self):
        self.pattern = r'^[A-Za-z0-9_]+$' # Matches alphanumeric strings and underscores
        self.regex = re.compile(self.pattern)

    def match(self, text):
        return self.regex.match(text)
```

##### Example 8: Regex with Lookaheads

```python
import re

pattern = r'(?<=@)\w+' # Matches words following '@'
text = 'Contact me @username'
result = re.findall(pattern, text)
print(result)
```

##### Example 9: Regex with Escaping

```python
import re

pattern = r'\[\d+\]' # Matches numbers in square brackets, e.g., [123]
text = 'List: [1], [23], [456]'
result = re.findall(pattern, text)
print(result)
```

##### Example 10: Regex in List Comprehension

```python
import re

text = 'The colors are red, green, and blue'
pattern = r'\b\w{3}\b' # Matches three-letter words
result = [word for word in re.findall(pattern, text)]
print(result)
```

You can use these examples to test if your highlighting function properly identifies and formats regex patterns within Python code.

## Summary

Python is a powerful language with a clear and simple syntax. Whether you are a beginner or an experienced developer, Python offers a rich set of features for different programming needs.

**Happy coding!** Remember, practice is key to mastering Python.

_For more details, check the [official Python documentation](https://docs.python.org/3/)._
