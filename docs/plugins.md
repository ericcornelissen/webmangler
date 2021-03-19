# WebMangler Plugins

A `WebManglerPlugin` is used by to tell the [WebMangler core] that something has
to be mangled and how to mangle it. For example, the core comes with 4 built-in
manglers to mangle CSS classes, CSS variables, HTML attributes, and HTML ids.

This document outlines how they work and how you can create one.

## What Actually is a Plugin

Perhaps surprisingly, a `WebManglerPlugin` is just a container for configuring
the mangle engine and the language plugins selected by the user. In practice
this means that a `WebManglerPlugin` combines pre-defined values with user
configurations to mangle certain parts of their code.

## Creating a Plugin

To create a `WebManglerPlugin` you need to create a [JavaScript class] (or
equivalent) that implements the [WebManglerPlugin interface]. This section goes
through the process of creating a `WebManglerPlugin` in [TypeScript] that can be
used to mangles HTML attributes. To get started you can use template below.

```ts
import type { MangleOptions, WebManglerPlugin } from "webmangler";

export class MyWebManglerPlugin implements WebManglerPlugin {
  constructor(options: any) {
    // TODO
  }

  options(): MangleOptions {
    // TODO
  }
}
```

### Preparing the `options` Method

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
  import type { MangleOptions, WebManglerPlugin } from "webmangler";

  export class MyWebManglerPlugin implements WebManglerPlugin {
+   private static CHAR_SET: string[] = [];

+   private patterns: string[];
+   private reservedNames: string[];

    constructor(options: any) {
      // TODO
    }

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

### Adding User Configuration

Next, we add the plugin user's ability to configure the plugin by implementing
the constructor. The implementation accepts a value for both `patterns` and
`reservedNames` from the user, but provides defaults in case the user doesn't
specify anything.

```diff
  import type { MangleOptions, WebManglerPlugin } from "webmangler";

  export class MyWebManglerPlugin implements WebManglerPlugin {
    private static CHAR_SET: string[] = [];

    private patterns: string[];
    private reservedNames: string[];

-   constructor(options: any) {
-     \\ TODO
+   constructor(options: { patterns?: string[]; reservedNames?: string[] }) {
+     this.patterns = options.patterns || ["data-[a-z]+"];
+     this.reservedNames = options.reservedNames || [];
    }

    options(): MangleOptions {
      return {
        patterns: this.patterns,
        charSet: MyWebManglerPlugin.CHAR_SET,
        manglePrefix: "data-",
        reservedNames: this.reservedNames,
        expressionOptions: [],
      };
    }
  }
```

### Selecting a Character Set

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

    private patterns: string[];
    private reservedNames: string[];

    constructor(options: { patterns?: string[]; reservedNames?: string[] }) {
      this.patterns = options.patterns || ["data-[a-z]+"];
      this.reservedNames = options.reservedNames || [];
    }

    options(): MangleOptions {
      return {
        patterns: this.patterns,
        charSet: MyWebManglerPlugin.CHAR_SET,
        manglePrefix: "data-",
        reservedNames: this.reservedNames,
        expressionOptions: [],
      };
    }
  }
```

### Configuring the Language Plugin

Finally, the plugin has to tell the language plugins how to find and replace
HTML attributes. This can be done through the `expressionOptions` by specifying
one or more [MangleExpressionOptions]. This is an object that instruct language
plugins what kinds of things to find and replace. To mangle HTML attributes we
need just one [MangleExpressionOptions] without further configuration.

```diff
  import type { MangleOptions, WebManglerPlugin } from "webmangler";
  import type { CharSet } from "webmangler/characters";

  import { ALL_LOWERCASE_CHARS } from "webmangler/characters";

  export class MyWebManglerPlugin implements WebManglerPlugin {
    private static CHAR_SET: CharSet = ALL_LOWERCASE_CHARS;

    private patterns: string[];
    private reservedNames: string[];

    constructor(options: { patterns?: string[]; reservedNames?: string[] }) {
      this.patterns = options.patterns || ["data-[a-z]+"];
      this.reservedNames = options.reservedNames || [];
    }

    options(): MangleOptions {
      return {
        patterns: this.patterns,
        charSet: MyWebManglerPlugin.CHAR_SET,
        manglePrefix: "data-",
        reservedNames: this.reservedNames,
        expressionOptions: [
+         { name: "attributes", options: null },
        ],
      };
    }
  }
```

### Putting it all Together

If you followed along (or skipped ahead) then the snippet below shows the `WebManglerPlugin` that we build. You can use this to mangle HTML attributes,
or alter it mangle any web concept you want!

```ts
import type { MangleOptions, WebManglerPlugin } from "webmangler";
import type { CharSet } from "webmangler/characters";

import { ALL_LOWERCASE_CHARS } from "webmangler/characters";

export class MyWebManglerPlugin implements WebManglerPlugin {
  private static CHAR_SET: CharSet = ALL_LOWERCASE_CHARS;

  private patterns: string[];
  private reservedNames: string[];

  constructor(options: { patterns?: string[]; reservedNames?: string[] }) {
    this.patterns = options.patterns;
    this.reservedNames = options.reservedNames;
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

[JavaScript class]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
[MangleOptions interface]: https://github.com/ericcornelissen/webmangler/blob/8217c3c72c9ea03f23fccdddb68a60971f37d51f/packages/core/src/types.ts#L3-L20
[TypeScript]: https://www.typescriptlang.org/
[WebMangler core]: https://www.npmjs.com/package/webmangler
[WebManglerPlugin interface]: https://github.com/ericcornelissen/webmangler/blob/8217c3c72c9ea03f23fccdddb68a60971f37d51f/packages/core/src/types.ts#L171-L185

[MangleExpressionOptions]: https://github.com/ericcornelissen/webmangler/blob/8217c3c72c9ea03f23fccdddb68a60971f37d51f/packages/core/src/types.ts#L94-L123
