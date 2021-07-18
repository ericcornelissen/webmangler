import type { MangleExpression } from "@webmangler/types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import {
  embedContentInBody,
  embedContentInContext,
} from "../../__tests__/benchmark-helpers";

import multiValueAttributeExpressionFactory from "../multi-value-attributes";

suite("HTML - Multi Value Attribute Expression Factory", function() {
  let expressions: Iterable<MangleExpression>;

  const patterns = "cls-[a-zA-Z0-9-]+";

  const contentWithMultiValueAttribute = embedContentInContext(`
    <div class="cls-foo cls-bar">
      <div id="foobar">
        <p class="cls-left">Hello</p>
        <p class="cls-green cls-small" data-foo="bar">World!</p>
      </div>
    </div>
  `);
  const contentWithoutMultiValueAttribute = `
    <div id="foo">
      <div id="bar">
        <p>Hello world!</p>
      </div>
    </div>
  `;

  suiteSetup(function() {
    expressions = multiValueAttributeExpressionFactory({
      attributeNames: ["class"],
    });
  });

  test("benchmark validity", function() {
    expect(expressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.1);
    const fileContent = embedContentInBody(contentWithMultiValueAttribute);

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
    const largeContent = contentWithMultiValueAttribute.repeat(100);
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

  test("large file without multi-value attributes", function() {
    const budget = getRuntimeBudget(1);
    const largeContent = contentWithoutMultiValueAttribute.repeat(100);
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
