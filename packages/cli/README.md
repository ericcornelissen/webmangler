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

const BuiltInLanguages = require("webmangler/languages/builtin").default;
const RecommendedManglers = require("webmangler/manglers/recommended").default;

module.exports = {
  plugins: [
    // Mangle CSS classes, CSS variables, and data attributes
    new RecommendedManglers(),
  ],
  languages: [
    // Mangle in CSS, HTML, and JavaScript
    new BuiltInLanguages(),
  ],
};
```

Add a script to your project manifest to mangle a folder, e.g.:

```json5
// package.json

{
  "scripts": {
    "mangle": "webmangler -w ./dist"
  }
}
```

Mangle all the files in the folder that match the configured languages:

```shell
$ npm run mangle
```

[WebMangler]: https://github.com/ericcornelissen/webmangler
