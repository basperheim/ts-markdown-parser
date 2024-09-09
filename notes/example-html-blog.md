---
title: "Website Builder Made with Angular Material CDK"
author: "Benji Asperheim"
date: 2024-09-04
keywords: web page builder, angular material, angular version, free website builder, website maker, website builder, ai website builder, free site builder, drag and drop website builder, drag and drop website, angular website builder, ai website creator, angular new project
slug: angular-ai-website-builder
---

# Web Builder Using Angular's Material CDK

Here are some [static builds](https://johnvansickle.com/ffmpeg/) to test.

## H2 Here

Another [test link](https://en.wikipedia.org/wiki/Advanced_Video_Coding) to see if it gets parsed properly.

### H3 Header

Here is an _italics_ test **WITH BOLD** _and_ a [link as well](https://example.com/__underscore_urls), so I hope this works.

Here is an _italics_ test **WITH BOLD** _and_ an ![image as well](https://example.com/__underscore_urls.jpg), so I hope this works.

In this article, we will cover how to create a basic drag-and-drop website builder using Angular (v18) and the [Material Component Dev Kit (CDK)](https://material.angular.io/cdk/categories). This Angular app is merely a proof-of-concept to convey the power and flexibility of using Angular's CDK library.

![AI Website Builder Screenshot of Web Page Builder](https://learnprogramming.us/cdn/angular-website-builder.gif)

**DISCLAIMER**: The example project was made with v18.2 of the `ng` Angular CLI tool as a standalone app (requires [NodeJS v18.9 or higher](https://nodejs.org/en/about/previous-releases)). I used ChatGPT 4o to help me write the code for this AI website builder. Angular now generates apps and components as "standalone", by default, since version 17 of Angular.

## Golang Test

```go
package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

const DOMAIN = "https://learnprogramming.us"
const STATIC_IP = "66.228.32.121"

// Helper function to serve an image file
func ServeImage(c *gin.Context, filePath string) {
	file, err := os.Open(filePath)
	if err != nil {
		// Return a 404 if the file is not found
		c.Status(http.StatusNotFound)
		return
	}
	defer file.Close()

	// Determine the content type based on the file extension
	ext := filepath.Ext(filePath)
	var contentType string
	ext = strings.ToLower(ext) // Convert extension to lowercase

	switch ext {
	case ".png":
		contentType = "image/png"
	case ".jpg", ".jpeg":
		contentType = "image/jpeg"
	case ".gif":
		contentType = "image/gif"
	default:
		// Return 415 if the file type is not supported
		c.Status(http.StatusUnsupportedMediaType)
		return
	}

	// Set the appropriate content type and serve the file
	c.Header("Content-Type", contentType)
	_, err = io.Copy(c.Writer, file)
	if err != nil {
		// Return 500 if there's an error while serving the file
		c.Status(http.StatusInternalServerError)
		return
	}
}
```

## Set Up the Angular Web Page Builder Project

We will need to create a new Angular app before we can start, and we will need the `ng` Angular CLI tool installed properly so that we can create a new project, and generate boilerplate code for things like new components.

### Install the Angular CLI

Ensure the Angular CLI tool (`ng`) is installed and functioning properly. You can use the `ng version` command to get the Angular CLI version:

```bash
ng version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI: 18.2.2
Node: 20.17.0
Package Manager: npm 10.8.2
```

If it's not yet installed, then you can install it using `npm` with the following command:

```bash
npm install -g @angular/cli@18
```

### Create a New Angular Project

You can create a new project using the `ng new` command (see the [CLI reference page](https://angular.dev/cli) for more details):

```bash
ng new website-builder
```

**NOTE**: Make sure to replace `website-builder` with the name of your project, and make sure to have Angular enable routing for your new Angular app (when prompted)—it will save you a lot of work and time later.

This will generate the app, but you first you will have to go through a simple, text-based "wizard" where you will need to select options about routing, [SSR](https://angular.dev/guide/ssr) (Server-Side Rendering), choosing Material, and selecting styles (like [SASS](https://sass-lang.com/)).

#### Angular Material CDK Library

Install the [Angular Material UI](https://material.angular.io/) library, which is required for the [drag-and-drop features of Material CDK](https://material.angular.io/cdk/drag-drop/overview). If you forgot to install Material, or the Angular CDK library, while creating your new app, then just add them with `npm install`:

```bash
npm install --save @angular/material @angular/cdk @angular/animations
```

You can also try using the `ng add` command:

```bash
ng add --save @angular/material
```

## TypeScript Models for the Web Builder

Before creating components, we should define models (TypeScript interfaces) so that TypeScript understands the data structure.

First, create a new `elements.model.ts` file (use a command like: `touch src/app/shared/models/elements.model.ts`), and the contents of the file should look like this:

```ts
export type ElementType = "header" | "paragraph" | "list";

export interface ElementModel {
  id: number;
  type: ElementType;
  content: string | string[];
}
```

**NOTE**: As you expand upon your app, and add more base elements, you will need to add the new names to the `type ElementType` enumerated line.

## Angular Components for the Web Page Builder

We're now ready to create some new components for the website builder!

Use the `ng g c` (or `ng generate component`) command to generate boilerplate files for a new standalone component. Here's the command to create the main route 'BuilderComponent' using the shortened syntax:

```bash
ng g c routes/builder
```

**NOTE**: Since v17 of Angular, _all_ newly generated web apps are standalone by default. If you're using an [older version of Angular](https://v16.angular.io/guide/standalone-components), then you will need to pass the `--standalone` flag (e.g. `ng g c new-component --standalone`) when executing the `ng g c` command to create a new component. See the latest [Angular documentation on standalone migration](https://angular.dev/reference/migrations/standalone) for more details.

### Contents of the Web Builder Component

The TypeScript code for the new web builder route component should look something like this:

```ts
// app/routes/builder/builder.component.ts
import { Component, ViewChild } from "@angular/core";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";

import { CanvasComponent } from "../../shared/components/canvas/canvas.component";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { ElementModel, ElementType } from "../../shared/models/elements.model";

@Component({
  selector: "app-builder",
  standalone: true,
  imports: [CommonModule, DragDropModule, CanvasComponent, ToolbarComponent],
  templateUrl: "./builder.component.html",
  styleUrl: "./builder.component.scss",
})
export class BuilderComponent {
  @ViewChild("canvas") canvas!: CanvasComponent;

  onAddElement(event: { type: ElementType; content: string }): void {
    this.canvas.addElement(event);
  }
}
```

This allows for the TypeScript to access, and modify, the canvas element which will be used to render custom HTML elements.

#### HTML for the Angular Website Builder Component

The HTML for the web builder component's `builder.component.html` file needs to look something like this:

```html
<div class="container">
  <app-toolbar (addElement)="onAddElement($event)"></app-toolbar>
  <app-canvas #canvas></app-canvas>
</div>
```

This will render the HTML canvas and toolbar components (which we will create next). Notice how the `onAddElement()` call will handle click events from the user.

#### SCSS for the Web Builder Component

You can have whatever CSS layout you want, but here's some example SCSS of how you might render the HTML canvas:

```css
/* routes/builder/builder.component.scss */
.container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.canvas {
  flex: 1;
  padding: 20px;
  border: 1px solid #ccc;
  overflow-y: auto;
}

.cdk-drag-preview {
  /* Styling for the preview of the dragged element */
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  padding: 10px;
}

.cdk-drag-placeholder {
  /* Placeholder style when an element is dragged */
  background: #f0f0f0;
  border: 1px dashed #ccc;
}

.cdk-drag-handle {
  cursor: move;
}
```

### Web Builder Canvas Component

Let's do the `CanvasComponent` next!

Use the `ng g c shared/components/canvas` command to create the files for the canvas, which will eventually render all of the custom elements created by the user.

#### TypeScript for the Canvas Component

The bulk of the business logic will be found in this CanvasComponent TypeScript file, as it will need to take care of adding, removing, and dragging custom user elements.

It should look like the following:

```ts
// shared/components/canvas/canvas.component.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DragDropModule, CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

import { ElementModel, ElementType } from "../../models/elements.model";
import { ElementComponent } from "../element/element.component";

@Component({
  selector: "app-canvas",
  standalone: true,
  imports: [CommonModule, DragDropModule, ElementComponent],
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.scss"],
})
export class CanvasComponent implements OnInit {
  elements: ElementModel[] = [];
  private idCounter = 0;

  ngOnInit(): void {
    // Example elements to start with
    this.addElement({ type: "header", content: "Header Example" });
    this.addElement({ type: "paragraph", content: "Paragraph text example." });
  }

  addElement({ type, content }: { type: ElementType; content: string }): void {
    const newElement: ElementModel = {
      id: this.idCounter++,
      type,
      content: type === "list" ? content.split(",") : content,
    };
    this.elements.push(newElement);
  }

  drop(event: CdkDragDrop<ElementModel[]>): void {
    moveItemInArray(this.elements, event.previousIndex, event.currentIndex);
  }

  // Delete an element from the canvas
  removeElement(index: number): void {
    this.elements.splice(index, 1);
  }
}
```

In the above example, the `ngOnInit(): void { ... }` code block contains some method calls to add a few default custom elements for when the app loads in a web browser.

The bulk of the `@angular/cdk/drag-drop` actions, and method calls, will take place here.

#### HTML for the Canvas Component

The canvas HTML will loop over the elements and render the individual `<app-element>` component instances (to be covered later in the article):

```html
<!-- shared/components/canvas/canvas.component.html -->
<div class="canvas" cdkDropList (cdkDropListDropped)="drop($event)">
  <ng-container *ngIf="elements.length > 0; else placeholder">
    <div class="ele-container" *ngFor="let element of elements; let i = index" cdkDrag>
      <app-element [element]="element" (delete)="removeElement(i)"></app-element>
    </div>
  </ng-container>
  <ng-template #placeholder>
    <div class="placeholder">
      <!-- Placeholder text or graphic -->
      Add an element to start building!
    </div>
  </ng-template>
</div>
```

The placeholder serves as a visual "queue" to help with better UX/UI design.

#### CSS for the Canvas Component

Here's some example SCSS of how you could visually style the canvas component, and properly layout the custom user elements:

```css
/* shared/components/canvas/canvas.component.scss */
.canvas {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; // Align elements at the top
  align-items: center;
  min-height: 100vh;
  min-width: 75vw;

  // Visual border for the drop area
  border: 1px dashed #ccc;

  // Hides scrollbar on elements while dragging
  .ele-container {
    scrollbar-width: none;
    overflow: hidden;
    -ms-overflow-style: none;
    overflow-y: hidden;
    overflow-x: hidden;

    // Slightly reduce the width for padding
    width: 90%;
  }
}

.placeholder {
  text-align: center;
  color: #888;
  font-size: 1.5rem;
}

.element {
  margin-bottom: 15px;
  min-height: 10rem;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;

  // Ensure that children (like the delete button) are positioned relative to the element
  position: relative;
}

.cdk-drag-preview {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  padding: 10px;
}

.cdk-drag-placeholder {
  background: #f0f0f0;
  border: 1px dashed #ccc;
}

.cdk-drag-handle {
  cursor: move;
}
```

### Toolbar Component for the Web Builder

Now we can work on the toolbar component. Once again, use the `ng g c` command to now create the toolbar files:

```bash
ng g c shared/components/toolbar
```

This will also create a new `shared/components/` directory for better organization of the shared component files.

#### TypeScript for the Toolbar Component

```ts
// shared/components/toolbar/toolbar.component.ts
import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ElementType } from "../../models/elements.model";

@Component({
  selector: "app-toolbar",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./toolbar.component.html",
  styleUrl: "./toolbar.component.scss",
})
export class ToolbarComponent {
  @Output() addElement = new EventEmitter<{ type: ElementType; content: string }>();

  elementContent: string = ""; // This will hold the content input by the user

  onAddElement(type: ElementType): void {
    this.addElement.emit({ type, content: this.elementContent });
    this.elementContent = ""; // Reset input field after adding an element
  }
}
```

#### HTML for the Toolbar Component

The HTML for the toolbar should look something like this:

```html
<!-- shared/components/toolbar/toolbar.component.html -->
<div class="toolbar">
  <input [(ngModel)]="elementContent" placeholder="Enter content" />
  <button mat-button (click)="onAddElement('header')">Add Header</button>
  <button mat-button (click)="onAddElement('paragraph')">Add Paragraph</button>
  <button mat-button (click)="onAddElement('list')">Add List</button>
</div>
```

These are just a few examples of the various HTML elements you can create for the web page builder. This is, by no means, a concise list of all of the possible elements that could be generated in this web app.

#### CSS for the Toolbar Component

Here is some example CSS for the toolbar component:

```css
/* shared/components/toolbar/toolbar.component.scss */
.toolbar {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-right: 1px solid #ccc;
  height: 100vh;
  width: 20vw;
  box-sizing: border-box;
}

button {
  margin-bottom: 10px;
}
```

### Element Component for the Web Page Builder

Finally, we just need to make one more user-element component which will represent the individual HTML elements, created by the user, being rendered on the canvas (Use the `ng g c shared/components/element` command to get started).

#### TypeScript for the Web Builder Element Component

We will need to have an array to store string for a list element, and the TypeScript will need an `@Input` decorator for when the canvas passes specific element data from the canvas:

```ts
// shared/components/element/element.component.ts
import { Component, Input, OnInit, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ElementModel, ElementType } from "../../models/elements.model";

@Component({
  selector: "app-element",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./element.component.html",
  styleUrl: "./element.component.scss",
})
export class ElementComponent implements OnInit {
  @Input() element!: ElementModel;
  @Output() delete = new EventEmitter<void>();

  elementsArray: any[] = [];

  ngOnInit(): void {
    // IF the content is an array of strings, instead of just a string value
    if (typeof this.element?.content === "object") {
      this.elementsArray = this.element.content;
    }
  }

  deleteElement(): void {
    // Emit the delete event to the parent component
    this.delete.emit();
  }
}
```

#### HTML for the Web Builder Element Component

The HTML will need to use a bunch of `*ngSwitchCase` directives to switch between the various user-element types, and a button to delete the element from the canvas:

```html
<div class="element">
  <button class="delete-button" (click)="deleteElement()">🗑️</button>
  <ng-container [ngSwitch]="element.type">
    <h1 *ngSwitchCase="'header'">{{ element.content }}</h1>
    <p *ngSwitchCase="'paragraph'">{{ element.content }}</p>
    <ul *ngSwitchCase="'list'">
      <li *ngFor="let item of elementsArray">{{ item }}</li>
    </ul>
  </ng-container>
</div>
```

The SCSS should look something like this:

```css
/* shared/components/element/element.component.scss */
.element {
  position: relative;
  margin: 0.5rem 0; // vertical margin for spacing
  padding: 1rem;
  min-height: 2rem;
  width: 100%;
  box-sizing: border-box;

  overflow: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: hidden;
  overflow-x: hidden;
}

.element::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}

.delete-button {
  transition: transform 0.2s;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  z-index: 10;
}

.delete-button:hover {
  transform: scale(1.2);
}
```

## Angular Routing for the Web Page Builder

Before the app will work properly we will need to modify the contents of the `app/app.routes.ts` file so that the default path of the app renders the main `BuilderComponent` we created earlier:

```ts
import { Routes } from "@angular/router";
import { BuilderComponent } from "./routes/builder/builder.component";

export const routes: Routes = [{ path: "", component: BuilderComponent }];
```

### Replace the Contents of app.component.html

You will also need to replace the default, boilerplate HTML found in `app.component.html` with the following:

```html
<!-- src/app/app.component.html -->
<router-outlet></router-outlet>
```

In Angular, the `<router-outlet></router-outlet>` directive serves as a placeholder where the router can "inject" the components associated with the pre-defined routes.

## Run the Angular Web Page Builder App

The final project should look like this:

```bash
tree -I node_modules
.
├── README.md
├── angular.json
├── package-lock.json
├── package.json
├── public
│   └── favicon.ico
├── src
│   ├── app
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── routes
│   │   │   └── builder
│   │   │       ├── builder.component.html
│   │   │       ├── builder.component.scss
│   │   │       ├── builder.component.spec.ts
│   │   │       └── builder.component.ts
│   │   └── shared
│   │       ├── components
│   │       │   ├── canvas
│   │       │   │   ├── canvas.component.html
│   │       │   │   ├── canvas.component.scss
│   │       │   │   ├── canvas.component.spec.ts
│   │       │   │   └── canvas.component.ts
│   │       │   ├── element
│   │       │   │   ├── element.component.html
│   │       │   │   ├── element.component.scss
│   │       │   │   ├── element.component.spec.ts
│   │       │   │   └── element.component.ts
│   │       │   └── toolbar
│   │       │       ├── toolbar.component.html
│   │       │       ├── toolbar.component.scss
│   │       │       ├── toolbar.component.spec.ts
│   │       │       └── toolbar.component.ts
│   │       └── models
│   │           └── elements.model.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json

12 directories, 34 files
```

Once all the components are set up and the routing is correctly configured, it's time to run the Angular Web Page Builder app locally. To start the development server, run the following command:

```bash
ng serve
```

This will compile the app and make it available at [http://localhost:4200/](http://localhost:4200/)—open a browser tab and navigate to that address. You should see the basic layout of the website builder, including the drag-and-drop functionality provided by the Material CDK.

If everything has been set up correctly, you'll be able to add elements to the canvas, move them around, and delete them as needed. This proof-of-concept can now be extended to a more feature-rich web page builder.

## Conclusion

By leveraging Angular’s Material CDK library, we have created a simple but flexible drag-and-drop web page builder. This serves as a proof-of-concept for how powerful Angular can be when creating interactive, dynamic applications. With further development, you could expand this app to include more sophisticated elements, advanced editing capabilities, and integration with a backend for saving user-built layouts. The possibilities are endless!

Awesome, glad to hear that it's working well now! The output you posted looks correct, and underscores are being properly handled in URLs, including for images.

Here are some edge cases and considerations that might still cause issues or could require additional handling in your markdown parser:

### 1. **Nested Markdown Syntax:**

If someone tries to nest markdown syntax (e.g., **bold** inside _italics_), make sure it’s handled gracefully. For example:

**Markdown Input:**

```md
Here is _italic **with bold inside**_ text.
```

**Expected HTML Output:**

```html
Here is <i>italic <b>with bold inside</b></i> text.
```

This might need careful handling depending on the order of your regex replacements.

### 2. **Escape Characters (`\`):**

Markdown allows you to escape special characters like `*`, `_`, and others by prefixing them with a backslash (`\`). For example:

**Markdown Input:**

```md
Here is an \*escaped asterisk\* and \_escaped underscore\_.
```

**Expected HTML Output:**

```html
Here is an *escaped asterisk* and _escaped underscore_.
```

Make sure your parser properly handles these escaped characters and doesn’t apply bold/italics to them.

### 3. **Handling Other Special HTML Tags:**

Right now, you're excluding processing inside `<a>` and `<img>` tags, but if you expand the functionality or expect other inline tags (e.g., `<code>`, `<span>`, `<strong>`, etc.), you might want to exclude them from regex processing as well. This becomes particularly important if you're embedding user-generated HTML.

For example:

```md
Here is <strong>already bold</strong> text.
```

You don’t want the parser to interfere with tags like `<strong>` or `<em>` already in the text.

### 4. **Block Elements (Lists, Headings, Code Blocks, etc.):**

If you're dealing with more than just inline markdown (e.g., headings, ordered/unordered lists, code blocks), ensure the parser processes them properly and maintains the structure.

For example:

```md
1. First item
2. Second item

# Heading 1

## Heading 2
```

**Expected HTML Output:**

```html
<ol>
  <li>First item</li>
  <li>Second item</li>
</ol>
<h1>Heading 1</h1>
<h2>Heading 2</h2>
```

If your parser is just for inline styles, this might not be relevant now, but it's good to think about if you expand the scope.

### 5. **Multiple Spaces (or Line Breaks):**

Markdown typically ignores multiple spaces or single line breaks between paragraphs. However, if you want to retain line breaks (e.g., using `<br>` tags), you could add a rule to convert multiple spaces or newlines into a `<br>` tag.

**Markdown Input:**

```md
This is line one.
This is line two.
```

**Expected HTML Output:**

```html
<p>This is line one.<br />This is line two.</p>
```

### 6. **HTML Entities:**

Markdown parsers generally allow embedding of HTML entities like `&amp;` (for `&`), `&lt;` (for `<`), etc. Ensure your parser doesn’t unintentionally alter or double-escape these.

**Markdown Input:**

```md
This is an ampersand: &amp; and a less-than symbol: &lt;.
```

**Expected HTML Output:**

```html
This is an ampersand: &amp; and a less-than symbol: &lt;.
```

### 7. **Code Blocks and Preformatted Text:**

Make sure any code block or preformatted text is handled properly, especially since your current parser supports inline code with backticks (`` ` ``). You'll want to ensure that block-level code doesn't get parsed by bold/italic rules.

**Markdown Input:**

```md

```

code block with _asterisks_ and _underscores_

```

```

**Expected HTML Output:**

```html
<pre><code>code block with *asterisks* and _underscores_</code></pre>
```
