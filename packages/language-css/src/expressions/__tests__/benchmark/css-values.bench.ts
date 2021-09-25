import type { MangleExpression } from "@webmangler/types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import { embedContentInContext } from "../common";

import cssDeclarationValueExpressionFactory from "../../css-values";

suite("CSS - CSS Value Expression Factory", function() {
  let expressions: Iterable<MangleExpression>;

  const patterns = "var-[a-zA-Z0-9-]+";

  const contentWithVariables = embedContentInContext(`
    #foobar {
      content: var(--var-foobar);
    }

    .foo {
      content: var(--var-bar);
    }

    .bar::after {
      content: var(--var-foo);
    }
  `);
  const contentWithoutVariables = `
    #foobar {
      content: "foobar";
    }

    .foo {
      content: "bar";
    }

    .bar::after {
      content: "foo";
    }
  `;

  suiteSetup(function() {
    expressions = cssDeclarationValueExpressionFactory({
      prefix: "var\\(--",
      suffix: "\\)",
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
    const budget = getRuntimeBudget(1);
    const fileContent = contentWithVariables.repeat(100);

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

  test("large file without variables", function() {
    const budget = getRuntimeBudget(1);
    const fileContent = contentWithoutVariables.repeat(100);

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
