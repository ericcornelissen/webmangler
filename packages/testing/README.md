# WebMangler Testing Utilities

A collection of testing utilities for _WebMangler_ packages and plugins.

## Usage

Install `@webmangler/testing` and its peer-dependencies, e.g.:

```shell
npm install @webmangler/testing sinon --save-dev
```

Import the testing utilities you want to use in you tests, e.g.:

```ts
// my-module.test.ts

import type { TestScenario } from "@webmangler/testing";

import { WebManglerPluginMock } from "@webmangler/testing";

suite("My test suite", function() {
  // ...
});
```

## Documentation

> The documentation uses [Mocha] with a Test Driven Development interface for
> examples as that is the testing style used by the _WebMangler_ project.

### Types

The testing utilities provide [TypeScript] types that can help structure your
tests. The following types are available:

- [TestScenario](#testscenario)

#### `TestScenario`

The `TestScenario` type can be used to group multiple similar test cases
together to execute them in a single `test()`. The best use case for this type
is as an array of scenarios that can use the same test logic.

##### Example

```ts
import type { TestScenario } from "@webmangler/testing";

import { makeStringLonger } from "../my-module.ts";

suite("My test suite", function() {
  type TestCase = {
    input: string;
    expected: string;
  };

  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "descriptive scenario name",
      cases: [
        {
          input: "foo",
          expected: "foobar",
        },
        {
          input: "Hello",
          expected: "Hello world!",
        },
      ],
    },
  ];

  for (const { name, cases } of scenarios) {
    test(name, function() {
      for (const testCase of cases) {
        const { input, expected } = testCase;

        const result = makeStringLonger(input);
        expect(result).to.equal(expected);
      }
    });
  }
});
```

### Mocks

The testing utilities provide [Sinon.JS]-based mocks of types expected by the
_WebMangler_ core. You can use these mocks when your tests need to integrate
with the _WebMangler_ core. The following mocks are available:

- [MangleExpressionMock](#mangleexpressionmock)
- [WebManglerLanguagePluginMock](#webmanglerlanguagepluginmock)
- [WebManglerPluginMock](#webmanglerpluginmock)

#### `MangleExpressionMock`

A mocked implementation of the `MangleExpression` type. Can be instantiated with
custom `findAll()` and `replaceAll()` behaviour if needed.

##### Example

```ts
import { MangleExpressionMock } from "@webmangler/testing";
import * as sinon from "sinon";

let mangleExpression;

// With default implementations of all methods.
mangleExpression = new MangleExpressionMock();

// With custom implementation of the `findAll` method.
const matches = ["foo", "bar"];
const stub = sinon.stub().returns(matches);
mangleExpression = new MangleExpressionMock({ findAll: stub });
```

##### Arguments

| Input              | Type   | Description                       |
| ------------------ | ------ | --------------------------------- |
| `stubs.findAll`    | [Stub] | Implementation of `findAll()`.    |
| `stubs.replaceAll` | [Stub] | Implementation of `replaceAll()`. |

#### `WebManglerLanguagePluginMock`

A mocked implementation of the `WebManglerPluginLanguage` type. Can be
instantiated with custom `getEmbeds()`,  `getExpressions()` and `getLanguages()`
behaviour if needed.

##### Example

```ts
import { WebManglerLanguagePluginMock } from "@webmangler/testing";
import * as sinon from "sinon";

let plugin;

// With default implementations of all methods.
plugin = new WebManglerLanguagePluginMock();

// With custom implementation of the `getExpressions` method.
const expressions = new Map();
const stub = sinon.stub().returns(expressions);
plugin = new WebManglerLanguagePluginMock({ getExpressions: stub });
```

##### Arguments

| Input                  | Type   | Description                           |
| ---------------------- | ------ | ------------------------------------- |
| `stubs.getEmbeds`      | [Stub] | Implementation of `getEmbeds()`.      |
| `stubs.getExpressions` | [Stub] | Implementation of `getExpressions()`. |
| `stubs.getLanguages`   | [Stub] | Implementation of `getLanguages()`.   |

#### `WebManglerPluginMock`

A mocked implementation of the `WebManglerPlugin` type. Can be instantiated with
custom `options()` behaviour if needed.

##### Example

```ts
import { WebManglerPluginMock } from "@webmangler/testing";
import * as sinon from "sinon";

let plugin;

// With default implementations of all methods.
plugin = new WebManglerPluginMock();

// With custom implementation of the `options` method.
const options = { patterns: "foo(bar|baz)" };
const stub = sinon.stub().returns(options);
plugin = new WebManglerPluginMock({ options: stub });
```

##### Arguments

| Input           | Type   | Description                    |
| --------------- | ------ | ------------------------------ |
| `stubs.options` | [Stub] | Implementation of `options()`. |

[mocha]: https://mochajs.org/ "Mocha"
[sinon.js]: https://sinonjs.org/ "Sinon.JS"
[stub]: https://sinonjs.org/releases/v9.2.4/stubs/ "Sinon Stub"
[typescript]: https://www.typescriptlang.org/ "TypeScript"
