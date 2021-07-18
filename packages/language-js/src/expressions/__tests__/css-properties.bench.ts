import type { MangleExpression } from "@webmangler/types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import { embedContentInContext } from "./benchmark-helpers";

import cssDeclarationPropertyExpressionFactory from "../css-properties";

suite("JavaScript - CSS Property Expression Factory", function() {
  let expressions: Iterable<MangleExpression>;

  const patterns = "var-[a-zA-Z0-9-]+";

  const contentWithProperties = embedContentInContext(`
    $element.style.getPropertyValue("--var-color");
    $element.style.getPropertyValue("--var-font-size");
    $element.style.getPropertyValue("--margin-left");
  `);
  const contentWithoutProperties = `
    const foo = "bar";
    const fooEl = document.getElementById(foo);
    const barEl = document.querySelector(".bar");
  `;

  suiteSetup(function() {
    expressions = cssDeclarationPropertyExpressionFactory({
      prefix: "--",
    });
  });

  test("benchmark validity", function() {
    expect(expressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.1);
    const fileContent = contentWithProperties;

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
    const fileContent = contentWithProperties.repeat(100);

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

  test("large file without properties", function() {
    const budget = getRuntimeBudget(1);
    const fileContent = contentWithoutProperties.repeat(100);

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
