# WebMangler Benchmarking Utilities

[![NPM Package][npm-image]][npm-url]

A collection of benchmarking utilities for _WebMangler_ packages and plugins.

## Usage

Install `@webmangler/benchmarking`, e.g.:

```shell
$ npm install @webmangler/benchmarking --save-dev
```

Import and use the benchmarking utilities in your benchmark, e.g.:

```ts
// my-module.bench.ts

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";

import slowFunction from "../my-module";

suite("My benchmark", function() {
  test("normal usage", function() {
    const runtimeBudget = getRuntimeBudget(5); // In milliseconds

    const benchmarkResult = benchmarkFn({
      fn: () => slowFunction("foo", "bar"),
    });
    expect(benchmarkResult.medianDuration).to.be.below(runtimeBudget);
  });
});
```

[npm-url]: https://www.npmjs.com/package/@webmangler/benchmarking "NPM package"
[npm-image]: https://img.shields.io/npm/v/@webmangler/benchmarking.svg
