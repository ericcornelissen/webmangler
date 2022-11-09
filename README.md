# WebMangler

> :warning: WebMangler is currently in alpha development. There are still bugs
> and APIs are still being changed. Use it at your own risk.

## Introduction

Welcome to the _WebMangler_ monorepo! WebMangler is a tool for web developers to
reduce the weight of websites. By analyzing all source files of a website it is
able to compress things that other tools can't, such as [CSS class names][css
class mangler] and [HTML ids][html id mangler].

WebMangler does not replace minifiers such as [terser] or [cssnano] and is
ideally used alongside other minifiers.

## Getting Started

To get started, add the WebMangler Core and CLI as development dependencies to
your project using npm (or yarn):

```bash
npm install --save-dev @webmangler/core @webmangler/cli
```

Next, create a configuration file named `.webmanglerrc.js` in your project and
add the following to it:

```js
// .webmanglerrc.js

const { BuiltInLanguagesSupport } = require("webmangler/languages");
const { RecommendedManglers } = require("webmangler/manglers");

module.exports = {
  plugins: [
    // Mangle CSS classes (that start with "cls-"), CSS variables, and data
    // attributes
    new RecommendedManglers(),
  ],
  languages: [
    // Mangle CSS, HTML, and JavaScript
    new BuiltInLanguagesSupport({
      cssExtensions: [".css"],
      htmlExtensions: [".html"],
      jsExtensions: [".js"],
    }),
  ],
};
```

Then, add a script to your project manifest to mangle the folder containing your
compiled website, for example:

```json5
// package.json

{
  "scripts": {
    "mangle": "webmangler ./dist --write --stats"
  }
}
```

Finally, run this script to mangle your website.

```shell
npm run mangle
```

## Example

The diff below illustrates how WebMangler compresses a website. The removed
lines show the original source code and the added lines show the mangled
version.

```diff
  <head>
    <style>
-   #id-button {
+   #a {
      font-weight: bold;
    }
-   .cls-text {
+   .a {
      color: red;
    }
    </style>
  </head>
  <body>
-   <p class="cls-text" data-message="Hello world!">Click the button</p>
+   <p class="a" data-a="Hello world!">Click the button</p>
-   <button id="id-button">Submit</button>
+   <button id="a">Submit</button>

    <script>
-     const btn = document.getElementById("id-button");
+     const btn = document.getElementById("a");
-     const txt = document.querySelector(".cls-text");
+     const txt = document.querySelector(".a");
      btn.addEventListener("click", () => {
-       const msg = txt.getAttribute("data-message");
+       const msg = txt.getAttribute("data-a");
        alert(msg);
      });
    </script>
  </body>
```

[css class mangler]: https://www.npmjs.com/package/@webmangler/mangler-css-classes
[html id mangler]: https://www.npmjs.com/package/@webmangler/mangler-html-ids

[cssnano]: https://cssnano.co/
[terser]: https://terser.org/
