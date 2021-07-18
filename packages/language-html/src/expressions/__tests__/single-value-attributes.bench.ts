import type { MangleExpression } from "@webmangler/types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import {
  embedContentInBody,
  embedContentInContext,
} from "../../__tests__/benchmark-helpers";

import singleValueAttributeExpressionFactory from "../single-value-attributes";

suite("HTML - Single Value Attribute Expression Factory", function() {
  let expressions: Iterable<MangleExpression>;

  const patterns = "id-[a-zA-Z0-9-]+";

  const contentWithSingleValueAttribute = embedContentInContext(`
    <div class="foo bar">
      <form id="id-foobar">
        <label for="id-input" data-foo="bar">Username</label>
        <input id="id-input"/>
      </form>
    </div>
  `);
  const contentWithoutSingleValueAttribute = `
    <div class="foo bar">
      <div class="container">
        <p>Lorem ispum dolor ...</p>
      </div>
    </div>
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
    const fileContent = embedContentInBody(contentWithSingleValueAttribute);

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
    const budget = getRuntimeBudget(5);
    const largeContent = contentWithSingleValueAttribute.repeat(100);
    const fileContent = embedContentInBody(largeContent);

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
    const largeContent = contentWithoutSingleValueAttribute.repeat(100);
    const fileContent = embedContentInBody(largeContent);

    let found: string[] = [];
    const result = benchmarkFn({
      setup: () => { found = []; },
      fn: () => {
        for (const expression of expressions) {
          found.push(...expression.findAll(fileContent, patterns));
        }
      },
    });

    expect(Array.from(found)).to.have.lengthOf(0);
    expect(result.medianDuration).to.be.below(budget);
  });
});
