# WebMangler CLI

The CLI for [WebMangler].

## Usage

Install both `webmangler-cli` and `webmangler`, e.g.:

```shell
$ npm install webmangler webmangler-cli --save-dev
```

Add your configuration in `.webmanglerrc.js` or `webmangler.config.js`, e.g.:

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

Mangle all the files in the folder that match the configured languages:

```shell
$ npm run mangle
```

[WebMangler]: https://github.com/ericcornelissen/webmangler
