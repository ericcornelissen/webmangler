# WebMangler Core

[![NPM Package][npm-image]][npm-url]

The _WebMangler Core_ is the central package of the _WebMangler_ ecosystem. It
can be used by itself programmatically or through [other packages and
plugins](#other-ways-to-use-webmangler).

## Usage

Install the `webmangler` core, e.g.:

```shell
$ npm install webmangler --save-dev
```

And use it programmatically, e.g.:

```js
import webmangler from "webmangler";

import { BuiltInLanguagesSupport } from "webmangler/languages";
import { RecommendedManglers } from "webmangler/manglers";

// Read in the files you want to mangle ...
const files = [
  { name: "index.css", content: "...", },
  { name: "index.html", content: "...", },
  { name: "index.js", content: "...", },
];

// and run WebMangler.
const mangledFiles = webmangler(files, {
  plugins: [new RecommendedManglers()],
  languages: [new BuiltInLanguagesSupport()],
});

console.log(mangledFiles[0]);
// Outputs:  { name: "index.css", content: "..." }
```

Which will mangler CSS classes, CSS variables, and HTML data attributes in CSS,
HTML, and JavaScript.

## Other ways to use WebMangler

- as a CLI - [WebMangler CLI](https://www.npmjs.com/package/webmangler-cli)

[npm-url]: https://www.npmjs.com/package/webmangler
[npm-image]: https://img.shields.io/npm/v/webmangler.svg
