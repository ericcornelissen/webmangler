import type { MangleExpression } from "@webmangler/types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import { embedContentInContext } from "../common";

import singleValueAttributeExpressionFactory from "../../single-value-attributes";

suite("CSS - Single Value Attribute Expression Factory", function() {
  let expressions: Iterable<MangleExpression>;

  const patterns = "val-[a-zA-Z0-9-]+";

  const contentWithSingleValueAttribute = embedContentInContext(`
    input[id="val-bar"] {
      font-family: sans-serif;
    }

    .foo[for="val-bar"] {
      content: "bar";
      color: #123;
    }
  `);
  const contentWithoutSingleValueAttribute = `
    body {
      font-family: sans-serif;
    }

    .foobar {
      content: "bar";
      color: #123;
    }
  `;

  suiteSetup(function() {
    expressions = singleValueAttributeExpressionFactory({
      attributeNames: ["id", "for"],
    });
  });

  test("benchmark validity", function() {
    expect(expressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.1);
    const fileContent = contentWithSingleValueAttribute;

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
    const fileContent = contentWithSingleValueAttribute.repeat(100);

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

  test("large file without single-value attributes", function() {
    const budget = getRuntimeBudget(1);
    const fileContent = contentWithoutSingleValueAttribute.repeat(100);

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
