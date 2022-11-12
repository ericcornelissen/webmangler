# WebMangler Core

[![NPM Package][npm-image]][npm-url]

The _WebMangler Core_ is the central package of the _WebMangler_ ecosystem. It
can be used by itself programmatically or through [other packages and
plugins](#other-ways-to-use-webmangler).

## Usage

Install the `webmangler` core, e.g.:

```shell
npm install webmangler --save-dev
```

And use it programmatically, e.g.:

```js
import webmangler from "@webmangler/core";

import { BuiltInLanguagesSupport } from "webmangler/languages";
import { RecommendedManglers } from "webmangler/manglers";

// Read in the files you want to mangle ...
const originalFiles = [
  { type: "css", content: "..." },
  { type: "html", content: "..." },
  { type: "js", content: "..." },
];

// and run WebMangler.
const { files } = webmangler(originalFiles, {
  plugins: [new RecommendedManglers()],
  languages: [new BuiltInLanguagesSupport()],
});

console.log(files[0]);
// Outputs:  { type: "css", content: "..." }
```

Which will mangle CSS classes, CSS variables, and HTML data attributes in CSS,
HTML, and JavaScript.

## Other ways to use WebMangler

- as a CLI - [WebMangler CLI]

[npm-url]: https://www.npmjs.com/package/@webmangler/core "NPM package"
[npm-image]: https://img.shields.io/npm/v/@webmangler/core.svg

[webmangler cli]: https://www.npmjs.com/package/@webmangler/cli
