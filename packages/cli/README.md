# WebMangler CLI

[![NPM Package][npm-image]][npm-url]

The CLI for [WebMangler].

## Usage

Install both `webmangler-cli` and `webmangler`, e.g.:

```shell
$ npm install webmangler webmangler-cli --save-dev
```

Add a configuration file for _WebMangler_ to your project, e.g.:

```js
// .webmanglerrc.js

const { BuiltInLanguagesSupport } = require("webmangler/languages");
const { RecommendedManglers } = require("webmangler/manglers");

module.exports = {
  plugins: [
    // Mangle CSS classes, CSS variables, and data attributes
    new RecommendedManglers(),
  ],
  languages: [
    // Mangle in CSS, HTML, and JavaScript
    new BuiltInLanguagesSupport(),
  ],
};
```

Add a script to your project manifest to mangle a folder, e.g.:

```json5
// package.json

{
  "scripts": {
    "mangle": "webmangler --write --stats ./dist"
  }
}
```

Mangle all the files matching the configured languages in that folder:

```shell
$ npm run mangle
```

[npm-url]: https://www.npmjs.com/package/webmangler-cli "NPM package"
[npm-image]: https://img.shields.io/npm/v/webmangler-cli.svg
[webmangler]: https://github.com/ericcornelissen/webmangler
