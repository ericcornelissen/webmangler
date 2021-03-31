# WebMangler Plugins

There exist two types of WebMangler plugins: one called `WebManglerPlugin` that
determines what to mangle, and one called `WebManglerLanguagePlugin` that
determines how to mangle in a specific language. This document outlines how they
work and how you can create one.

- [Plugins](#plugins)
  - [What is a Plugin](#what-is-a-plugin)
  - [Create a Plugin](#create-a-plugin)
- [Language Plugins](#language-plugins)
  - [What is a Language Plugin](#what-is-a-language-plugin)
  - [Create a Language Plugin](#create-a-language-plugin)

## Plugins

A `WebManglerPlugin` is used by to tell the [WebMangler core] that something has
to be mangled and how to mangle it. For example, the core comes with 4 built-in
manglers to mangle CSS classes, CSS variables, HTML attributes, and HTML ids.

### What is a Plugin

Perhaps surprisingly, a `WebManglerPlugin` is just a container for configuring
the mangle engine and the language plugins selected by the user. In practice
this means that a `WebManglerPlugin` combines pre-defined values with user
configurations to mangle certain parts of their code.

### Create a Plugin

To create a `WebManglerPlugin` you need to create a [JavaScript class] (or
equivalent) that implements the [WebManglerPlugin interface]. This section goes
through the process of creating a `WebManglerPlugin` in [TypeScript] that can be
used to mangles HTML attributes. To get started you can use template below.

```ts
import type { MangleOptions, WebManglerPlugin } from "webmangler";

export class MyWebManglerPlugin implements WebManglerPlugin {
  constructor(options?: unknown) {
    // TODO
  }

  options(): MangleOptions {
    // TODO
  }
}
```

#### Preparing the `options` Method

The `options` method of the plugin should return an object implementing the
[MangleOptions interface]. This object contains instructions for the mangle
engine and language plugins. In this step we only specify what variables will be
returned, not their values.

In this implementation the `patterns` and `reservedNames` will come from the
plugin instance. This is because we want the plugin user to configure these. The
`patterns` are used to specify the pattern of attributes that should be mangled
as, presumably, not all attributes should be mangled. The `reservedNames` can be
used to prevent the mangle engine from outputting certain names.

The `charSet`, or character set, comes from a static field of the class as it
should always be the same. The value of the `charSet` is used by the mangle
engine to generate mangled names.

The `manglePrefix` is hardcoded to be the string "data-". This ensures that all
mangled values use the "data-" prefix, making them data attributes. You could
allow the user configure this value, but in this example we won't allow that.

Lastly, the `expressionOptions` are currently set to an empty array. This value
is used to configure the language plugins and we will come back to that later.

```diff
  export class MyWebManglerPlugin implements WebManglerPlugin {
+   private static CHAR_SET: string[] = [];

+   private patterns: string[];
+   private reservedNames: string[];

    ...

    options(): MangleOptions {
-     // TODO
+     return {
+       patterns: this.patterns,
+       charSet: MyWebManglerPlugin.CHAR_SET,
+       manglePrefix: "data-",
+       reservedNames: this.reservedNames,
+       expressionOptions: [],
+     };
    }
  }
```

#### Adding User Configuration

Next, we add the plugin user's ability to configure the plugin by implementing
the constructor. The implementation accepts a value for both `patterns` and
`reservedNames` from the user, but provides defaults in case the user doesn't
specify anything.

```diff
  export class MyWebManglerPlugin implements WebManglerPlugin {
    ...

-   constructor(options?: unknown) {
-     \\ TODO
+   constructor(options?: { patterns?: string[]; reservedNames?: string[] }) {
+     this.patterns = options?.patterns || ["data-[a-z]+"];
+     this.reservedNames = options?.reservedNames || [];
    }

    ...
  }
```

#### Selecting a Character Set

Next up, we choose a character set for the plugin. For brevity, this plugin will
use a character set of only lowercase letters (as HTML attributes are case
insensitive). Additionally, we now use the proper type for the `CHAR_SET` field.

```diff
  import type { MangleOptions, WebManglerPlugin } from "webmangler";
+ import type { CharSet } from "webmangler/characters";

+ import { ALL_LOWERCASE_CHARS } from "webmangler/characters";

  export class MyWebManglerPlugin implements WebManglerPlugin {
-   private static CHAR_SET: string[] = [];
+   private static CHAR_SET: CharSet = ALL_LOWERCASE_CHARS;

    ...
  }
```

#### Configuring the Language Plugin

Finally, the plugin has to tell the language plugins how to find and replace
HTML attributes. This can be done through the `expressionOptions` by specifying
one or more [MangleExpressionOptions]. This is an object that instruct language
plugins what kinds of things to find and replace. To mangle HTML attributes we
need just one [MangleExpressionOptions] without further configuration.

```diff
  export class MyWebManglerPlugin implements WebManglerPlugin {
    ...

    options(): MangleOptions {
      return {
        ...
        expressionOptions: [
+         { name: "attributes", options: null },
        ],
      };
    }
  }
```

#### Putting it all Together

If you followed along (or skipped ahead) then the snippet below shows the
`WebManglerPlugin` that we build. You can use this to mangle HTML attributes, or
alter it mangle any web concept you want!

```ts
import type { MangleOptions, WebManglerPlugin } from "webmangler";
import type { CharSet } from "webmangler/characters";

import { ALL_LOWERCASE_CHARS } from "webmangler/characters";

export class MyWebManglerPlugin implements WebManglerPlugin {
  private static CHAR_SET: CharSet = ALL_LOWERCASE_CHARS;

  private patterns: string[];
  private reservedNames: string[];

  constructor(options?: { patterns?: string[]; reservedNames?: string[] }) {
    this.patterns = options?.patterns || ["data-[a-z]+"];
    this.reservedNames = options?.reservedNames || [];
  }

  options(): MangleOptions {
    return {
      patterns: this.patterns,
      charSet: MyWebManglerPlugin.CHAR_SET,
      manglePrefix: "data-",
      reservedNames: this.reservedNames,
      expressionOptions: [
        { name: "attributes", options: null },
      ],
    };
  }
}
```

## Language Plugins

A `WebManglerLanguagePlugin` is used by the [WebMangler core] to find string to
mangle, and to replace such original strings by a mangled value. For example,
the core comes with 3 built-in language plugins, namely CSS, HTML, and
JavaScript.

### What is a Language Plugin

A `WebManglerLanguagePlugin` is essentially one or more sets of expressions that
the [WebMangler core] uses to find and replace strings. A plugin provides a list
of sets of expressions it wants to use, and the language plugin defines these
expressions. These expressions are used by WebMangler to find strings to mangle
and replace them as well.

### Create a Language Plugin

To create a `WebManglerLanguagePlugin` you need to create a [JavaScript class]
(or equivalent) that implements the [WebManglerPlugin interface]. This section
goes through the process of creating a CSS `WebManglerLanguagePlugin` in
[TypeScript] that only supports mangling CSS classes. To get started you can use
template below.

```ts
import type { MangleExpression, WebManglerLanguagePlugin } from "webmangler";

export class MyWebManglerLanguagePlugin implements WebManglerLanguagePlugin {
  constructor(options?: unknown) {
    // TODO
  }

  getExpressions(
    name: string,
    options: unknown,
  ): Map<string, MangleExpression[]> {
    // TODO
  }

  getLanguages(): string[] {
    // TODO
  }
}
```

#### Specifying the Languages

First, we add the languages that we want to support. We do this by defining an
array of the languages we want to support. This list should contain all file
extensions (without leading dot) that might be used for files of the language.
In this implementation we will just support CSS.

Additionally, it is recommended to let users specify more "languages" that
should be supported. This is for two reasons, first it allows them to use your
plugin with non-standard extensions for the language, and second it allows the
plugin to be used for a similar language even if the you don't explicitly
support it.

```diff
  export class MyWebManglerLanguagePlugin implements WebManglerLanguagePlugin {
+   private static DEFAULT_LANGUAGES = ["css"];

+   private languages: string[];

-   constructor(options?: unknown) {
-     // TODO
+   constructor(options?: { languages?: string[] }) {
+     this.languages = MyWebManglerLanguagePlugin.DEFAULT_LANGUAGES.concat(
+       (options?.languages || []),
+     );
    }

    ...

    getLanguages(): string[] {
-     // TODO
+     return this.languages;
    }
  }
```

#### Preparing the `getExpressions` Method

The `getExpressions` method should return a map from languages to the
expressions that belong to the category specified by the `name` parameter. In
this implementation, the expression will always be the same for every supported
language, and the only category of expression supported is `"css-classes"`. In
the next step we will actually add the expressions.

```diff
  export class MyWebManglerLanguagePlugin implements WebManglerLanguagePlugin {
    ...

    getExpressions(
      name: string,
      options: unknown,
    ): Map<string, MangleExpression[]> {
-     // TODO
+     const map = new Map();
+     if (name === "css-classes") {
+       this.languages.forEach((language) =>
+         map.set(language, []));
+     }
+     return map;
    }

    ...
  }
```

#### Defining `MangleExpression`s

Lastly, we will define the `MangleExpression`s that instruct the _WebMangler_
how to find and replace strings to mangle. For brevity, this implementation will
use one naïve expressions using the [SingleGroupMangleExpression] utility.

When you're creating your own `WebManglerLanguagePlugin`, make sure to [read
about `MangleExpression`s][MangleExpressions]

```diff
  import type { MangleExpression, WebManglerLanguagePlugin } from "webmangler";

+ import { SingleGroupMangleExpression } from "webmangler/languages/utils";

  export class MyWebManglerLanguagePlugin implements WebManglerLanguagePlugin {
    ...

    getExpressions(
      name: string,
      options: unknown,
    ): Map<string, MangleExpression[]> {
      const map = new Map();
      if (name == "css-classes") {
+       options = options as { selector: string };
        this.languages.forEach((language) =>
          map.set(language, [
+           new SingleGroupMangleExpression(
+             `(?<=${options.selector})(?<main>%s)(?=\\s)`,
+             "main",
+           ),
          ]));
      }
      return map;
    }

    ...
  }
```

#### Putting it all Together

If you followed along (or skipped ahead) then the snippet below shows the
`WebManglerLanguagePlugin` that we build. This language plugin is not really
useful in practice, but it should serve as a starting point when you create your
own language plugin.

```ts
import type { MangleExpression, WebManglerLanguagePlugin } from "webmangler";

import { SingleGroupMangleExpression } from "webmangler/languages/utils";

export class MyWebManglerLanguagePlugin implements WebManglerLanguagePlugin {
  private static DEFAULT_LANGUAGES = ["css"];

  private expressions: MangleExpression[];
  private languages: string[];

  constructor(options?: { languages?: string[] }) {
    this.languages = MyWebManglerLanguagePlugin.DEFAULT_LANGUAGES.concat(
      (options?.languages || []),
    );
  }

  getExpressions(
    name: string,
    options: unknown,
  ): Map<string, MangleExpression[]> {
    const map = new Map();
    if (name == "css-classes") {
      options = options as { selector: string };
      this.languages.forEach((language) =>
        map.set(language, [
          new SingleGroupMangleExpression(
            `(?<=${options.selector})(?<main>%s)(?=\\s)`,
            "main",
          ),
        ]));
    }
    return map;
  }

  getLanguages(): string[] {
    return this.languages;
  }
}
```

[javascript class]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes "JavaScript Class"
[mangleexpressionoptions]: https://github.com/ericcornelissen/webmangler/blob/8217c3c72c9ea03f23fccdddb68a60971f37d51f/packages/core/src/types.ts#L94-L123 "MangleExpressionOptions"
[mangleexpressions]: ./expressions.md "MangleExpressions"
[mangleoptions interface]: https://github.com/ericcornelissen/webmangler/blob/8217c3c72c9ea03f23fccdddb68a60971f37d51f/packages/core/src/types.ts#L3-L20 "MangleOptions interface"
[typescript]: https://www.typescriptlang.org/ "TypeScript"
[webmangler core]: https://www.npmjs.com/package/webmangler "WebMangler core"
[webmanglerlanguageplugin interface]: https://github.com/ericcornelissen/webmangler/blob/8217c3c72c9ea03f23fccdddb68a60971f37d51f/packages/core/src/types.ts#L187-L216 "WebManglerLanguagePlugin interface"
[webmanglerplugin interface]: https://github.com/ericcornelissen/webmangler/blob/8217c3c72c9ea03f23fccdddb68a60971f37d51f/packages/core/src/types.ts#L171-L185 "WebManglerPlugin interface"
[singlegroupmangleexpression]: https://github.com/ericcornelissen/webmangler/blob/main/packages/core/src/languages/utils/mangle-expressions/single-group.class.ts "SingleGroupMangleExpression"
