import type { MangleExpression } from "@webmangler/types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import { embedContentInContext } from "./benchmark-helpers";

import querySelectorExpressionFactory from "../query-selectors";

suite("JavaScript - Query Selector Expression Factory", function() {
  let expressions: Iterable<MangleExpression>;

  const patterns = "cls-[a-zA-Z0-9-]+";

  const contentWithQuerySelector = embedContentInContext(`
    const div = document.querySelectorAll("div");
    const foo = document.querySelectorAll(".cls-foo");
    const bar = document.querySelectorAll("#bar");
  `);
  const contentWithoutQuerySelector = `
    const foo = "bar";
    const fooEl = document.getElementById(foo);
  `;

  suiteSetup(function() {
    expressions = querySelectorExpressionFactory({
      prefix: "\\.",
    });
  });

  test("benchmark validity", function() {
    expect(expressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.1);
    const fileContent = contentWithQuerySelector;

    let found: string[] = [];
    const result = benchmarkFn({
      setup: () => { found = []; },
      fn: () => {
        for (const expression of expressions) {
          found.push(...expression.findAll(fileContent, patterns));
        }
      },
    });

    expect(found).to.have.length.greaterThan(0);
    expect(result.medianDuration).to.be.below(budget);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(3);
    const fileContent = contentWithQuerySelector.repeat(100);

    let found: string[] = [];
    const result = benchmarkFn({
      setup: () => { found = []; },
      fn: () => {
        for (const expression of expressions) {
          found.push(...expression.findAll(fileContent, patterns));
        }
      },
    });

    expect(found).to.have.length.greaterThan(0);
    expect(result.medianDuration).to.be.below(budget);
  });

  test("large file without query selectors", function() {
    const budget = getRuntimeBudget(1);
    const fileContent = contentWithoutQuerySelector.repeat(100);

    let found: string[] = [];
    const result = benchmarkFn({
      setup: () => { found = []; },
      fn: () => {
        for (const expression of expressions) {
          found.push(...expression.findAll(fileContent, patterns));
        }
      },
    });

    expect(found).to.have.lengthOf(0);
    expect(result.medianDuration).to.be.below(budget);
  });
});
