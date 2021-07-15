import type { MangleExpression } from "@webmangler/types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import { embedContentInContext } from "./benchmark-helpers";

import cssDeclarationPropertyExpressionFactory from "../css-properties";

suite("CSS - CSS Property Expression Factory", function() {
  let expressions: Iterable<MangleExpression>;

  const patterns = "var-[a-zA-Z0-9-]+";

  const contentWithVariables = embedContentInContext(`
    :root {
      --var-font-family: sans-serif;
    }

    .foo {
      --var-color: red;
      font-family: var(--var-font-family);
    }

    .foo[data-bar]::after {
      content: "bar";
      color: #123;
    }
  `);
  const contentWithoutVariables = `
    body {
      font-family: sans-serif;
    }

    .foo {
      color: #321;
    }

    #bar::after {
      content: "bar";
      color: #123;
    }
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
    const fileContent = contentWithVariables;

    let found: string[] = [];
    const result = benchmarkFn({
      fn: () => {
        for (const expression of expressions) {
          found = Array.from(expression.findAll(fileContent, patterns));
        }
      },
    });

    expect(found).to.have.length.greaterThan(0);
    expect(result.medianDuration).to.be.below(budget);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(1);
    const fileContent = contentWithVariables.repeat(100);

    let found: string[] = [];
    const result = benchmarkFn({
      fn: () => {
        for (const expression of expressions) {
          found = Array.from(expression.findAll(fileContent, patterns));
        }
      },
    });

    expect(found).to.have.length.greaterThan(0);
    expect(result.medianDuration).to.be.below(budget);
  });

  test("large file without variables", function() {
    const budget = getRuntimeBudget(1);
    const fileContent = contentWithoutVariables.repeat(100);

    let found: string[] = [];
    const result = benchmarkFn({
      fn: () => {
        for (const expression of expressions) {
          found = Array.from(expression.findAll(fileContent, patterns));
        }
      },
    });

    expect(Array.from(found)).to.have.lengthOf(0);
    expect(result.medianDuration).to.be.below(budget);
  });
});
