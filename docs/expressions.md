# Expressions

A `MangleExpression` is an object provided by language plugins and used by the
[WebMangler core] to find and replace strings that should be mangled. This
document outlines how they work and how you can create one.

- [What is a `MangleExpression`](#what-is-a-MangleExpression)
- [The `MangleExpression` Interface](#the-MangleExpression-interface)
  - [`exec`](#exec)
  - [`replaceAll`](#replaceAll)
- [Create a `MangleExpression`](#create-a-MangleExpression)
- [Utilities](#utilities)
  - [`SingleGroupMangleExpression`](#SingleGroupMangleExpression)
  - [`NestedGroupExpression`](#NestedGroupExpression)

## What is a `MangleExpression`

A `MangleExpression` is an object that finds and replaces substrings when
provided with a regular expression. It is different from a normal regular
expression in that part of the expression is predetermined. This is best
understood through an example. Say we want to match classes in CSS. To do this,
we can define a `MangleExpression` that can find and replace strings with a
leading dot (`.`), for example this (naïve) expression:

```re
(?:\.)(%s)(?:\s|\{)
```

This `MangleExpression` will be provided with specific patterns by the
[WebMangler core] to find and replace only those classes that match a given
pattern, for example those with the prefix "cls-":

```re
(?:\.)(cls-[a-z]+)(?:\s|\{)
```

## The `MangleExpression` Interface

### [`exec`]

Should return zero or more substrings in a string matching a given pattern.

```ts
type exec = (s: string, pattern: string) => Iterable<string>;
```

Where `s` is the string to match against, and `pattern` is a regular
expression to match with.

### [`replaceAll`]

Should replace substrings in a string for a given pattern and mapping.

```ts
type replaceAll = (s: string, replacements: Map<string, string>) => string;
```

Where `s` is the string to match against, and `replacements` is a mapping from
strings found in `s` to what they should be replaced by.

## Create a `MangleExpression`

This section describes how to create a `MangleExpression` from scratch. In many
cases you should be able to create one using one of the utilities.

To create a `MangleExpression` you need to create a [JavaScript class] (or
equivalent) that implements the [MangleExpression interface]. This section goes
through the process of creating a `MangleExpression` in [TypeScript] that can be
used to selectors in CSS. To get started you can use template below.

```ts
import type { MangleExpression } from "webmangler";

export class MyMangleExpression implements MangleExpression {
  constructor() {
    // TODO
  }

  public * exec(s: string, pattern: string): IterableIterator<string> {
    // TODO
  }

  public replaceAll(s: string, replacements: Map<string, string>): string {
    // TODO
    return s;
  }
}
```

### Define a Pattern Template

The first thing we will do is write the pattern template for the expression.
This is the pattern that the patterns provided by the [WebMangler core] will be
inserted into. For brevity the pattern template here is a bit simplistic, but we
do allow the users of this `MangleExpression` to choose which selector should be
matched.

```diff
  export class MyMangleExpression implements MangleExpression {
+   private readonly patternTemplate: string;

-   constructor() {
-     // TODO
+   constructor(selector: "\\." | "\\#") {
+     this.patternTemplate = `(?<=${selector})($<main>%s)(?=\\s|\\{)`;
    }

    ...
  }
```

### Helper to Convert the Template into an Expression

Next, we will define a helper function that converts this template into an
expression for a given pattern. The reason for this is that both `exec` and
`replaceAll` need to do this conversion.

```diff
  import { MangleExpression } from "webmangler";

+ import { format } from "util";

  export class MyMangleExpression implements MangleExpression {
    ...

+   private newRegExp(pattern: string): RegExp {
+     const rawExpr = format(this.patternTemplate, pattern);
+     return new RegExp(rawExpr, "gm");
+   }
  }
```

### Implementing `exec`

Then we will implement `exec` by using the regular expression returned by the
helper to find matches. To this end we use the same-name function of regular
expressions.

```diff
  export class MyMangleExpression implements MangleExpression {
    ...

    public * exec(s: string, pattern: string): IterableIterator<string> {
-     // TODO
+     const regExp = this.newRegExp(pattern);
+     let match: RegExpExecArray | null = null;
+     while ((match = regExp.exec(s)) !== null) {
+       const groups = match.groups;
+       yield groups.main;
+     }
    }

    ...
  }
```

### Implementing `replaceAll`

Lastly we will implement `replaceAll` by using the regular expression returned
by the helper to find matches. To this end we use the `replace` method of
strings with a custom replacement function which gets the correct replacement
from the provided mapping.

```diff
  export class MyMangleExpression implements MangleExpression {
    ...

    public replaceAll(s: string, replacements: Map<string, string>): string {
-     // TODO
-     return s;
+     if (replacements.size === 0) return s;
+     const pattern = Array.from(replacements.keys()).join("|");
+     const regExp = this.newRegExp(pattern);
+     return s.replace(regExp, (...args: unknown[]): string => {
+       const groups = args[args.length - 1];
+       const original = groups.main;
+       return replacements.get(original);
+     });
    }

    ...
  }
```

#### Putting it all Together

If you followed along (or skipped ahead) then the snippet below shows the
`MangleExpression` that we build. You can use this to find and replace
stand-alone CSS selectors for classes and IDs.

```ts
import type { MangleExpression } from "webmangler";

import { format } from "util";

export class MyMangleExpression implements MangleExpression {
  private readonly patternTemplate: string;

  constructor(selector: "\\." | "\\#") {
    this.patternTemplate = `(?<=${selector})($<main>%s)(?=\\s|\\{)`;
  }

  public * exec(s: string, pattern: string): IterableIterator<string> {
    const regExp = this.newRegExp(pattern);
    let match: RegExpExecArray | null = null;
    while ((match = regExp.exec(s)) !== null) {
      const groups = match.groups;
      yield groups.main;
    }
  }

  public replaceAll(s: string, replacements: Map<string, string>): string {
    if (replacements.size === 0) return s;
    const pattern = Array.from(replacements.keys()).join("|");
    const regExp = this.newRegExp(pattern);
    return s.replace(regExp, (...args: unknown[]): string => {
      const groups = args[args.length - 1];
      const original = groups.main;
      return replacements.get(original);
    });
  }

  private newRegExp(pattern: string): RegExp {
    const rawExpr = format(this.patternTemplate, pattern);
    return new RegExp(rawExpr, "gm");
  }
}
```

## Utilities

This section describes the utilities provided by the [WebMangler Core] to create
your own `MangleExpression`. In many cases you can use these instead of creating
one from scratch.

### `SingleGroupMangleExpression`

This utility class can be used to simply find and replace matching substrings.
It will find substrings matching the pattern of the first argument and return
the substring from the named group specified by the second argument. The
patterns provided by the [WebMangler core] will be put at the first `%s`.

```ts
import { SingleGroupMangleExpression } from "webmangler/languages/utils";

const GROUP_NAME = "main";
const expression = new SingleGroupMangleExpression(
  `(?<=\\.)(?<${GROUP_NAME}>%s)(?=\\s|\\{)`,
  GROUP_NAME,
);
```

This (naïve) example will find and replace patterns with a leading `.` and a
trailing space or `{`. For example, for the pattern `cls-[a-z]+`, the search
expression will be `(?<=\.)(?<main>cls-[a-z]+)(?=\s|\{)`. This would match
`cls-foo` in the following CSS using `exec`:

```css
.container { }
.cls-foo { }
#cls-bar { }
```

And provided the mapping `[cls-foo -> a]` change it into the following using
`replaceAll`:

```css
.container { }
.a { }
#cls-bar { }
```

### `NestedGroupExpression`

This utility class can be used to find a replace matching substrings within
substrings. It will first find substrings matching the pattern of the first
argument and than substrings within matching the pattern of the second argument.
Both of these arguments will be provided with the same pattern. The third
argument is used to specify the name of the matched group to return. Both
patterns must use the same group name. The patterns provided by the [WebMangler
core] will be put at the first `%s`.

```ts
import { NestedGroupExpression } from "webmangler/languages/utils";

const GROUP_NAME = "main";
const expression = new NestedGroupExpression(
  `(?<=\\<[^>]*)(?<${GROUP_NAME}>%s)(?=[^>]*\\>)`,
  `(?<=\\s|^)(?<${GROUP_NAME}>%s)(?=\\s|\\=|$)`,
  GROUP_NAME,
);
```

This (naïve) example will find and replace patterns in a HTML tag if surrounded
by whitespace. For example, for the pattern `data-[a-z]+`, the outer search
expression will be `(?<=\<[^>]*)(?<main>data-[a-z]+)(?=[^>]*\>)`. This would
match `<p data-foo="bar">` in the following HTML using `exec`:

```html
<div class="container">
  <p data-foo="bar">Lorem ipsum dolor ...</p>
</div>
```

The inner search expression will be `(?<=\s|^)(?<main>data-[a-z]+)(?=\s|\=|$)`.
This would match the attribute `data-foo`, and provided the mapping
`[data-foo -> a]` change it into the following using `replaceAll`:

```html
<div class="container">
  <p a="bar">Lorem ipsum dolor ...</p>
</div>
```

[`exec`]: https://github.com/ericcornelissen/webmangler/blob/c8089ead6730b497a17a8dbf1c4d0ee7e03fc06b/packages/core/src/types.ts#L88-L96 "MangleExpression's exec method"
[`replaceall`]: https://github.com/ericcornelissen/webmangler/blob/c8089ead6730b497a17a8dbf1c4d0ee7e03fc06b/packages/core/src/types.ts#L98-L106 "MangleExpression's replace all method"
[javascript class]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes "JavaScript Class"
[mangleexpression interface]: https://github.com/ericcornelissen/webmangler/blob/c8089ead6730b497a17a8dbf1c4d0ee7e03fc06b/packages/core/src/types.ts#L80-L107 "mangleExpression interface"
[typescript]: https://www.typescriptlang.org/ "TypeScript"
[webmangler core]: https://www.npmjs.com/package/webmangler "WebMangler core"
