# WebMangler

A minifier/uglifier/obfuscator/mangler for web sites and web apps.

> :warning: WebMangler is currently in alpha development and is not yet ready
> for production use.

## What is WebMangler

WebMangler reduces your website size by mangling identifiers such as CSS classes
and data attributes. It analyzes your HTML, CSS, and JavaScript - or other
languages, if you want - and replaces identifiers by short string consistently
throughout your project.

It is **NOT** a replacement for JavaScript minimizers such as [Terser] or
[UglifyJS]. If you're using WebMangler, you should probably also be using a
JavaScript minimizer.

## Getting Started

You can use WebMangler in the various ways listed below. If you're unsure, try
the CLI.

- Command line: [WebMangler CLI]
- Programmatically: [WebMangler Core]

[terser]: https://terser.org/ "Terser"
[uglifyjs]: https://www.npmjs.com/package/uglify-js "UglifyJS"
[webmangler cli]: https://www.npmjs.com/package/webmangler-cli "WebMangler CLI"
[webmangler core]: https://www.npmjs.com/package/webmangler "WebMangler Core"
