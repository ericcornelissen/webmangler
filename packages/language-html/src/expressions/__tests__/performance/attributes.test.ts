import type { MangleExpression } from "@webmangler/types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import {
  embedContentInBody,
  embedContentInContext,
} from "../common";

import expressionsFactory from "../../attributes";

suite("HTML - Attribute Expression Factory", function() {
  let expressions: Iterable<MangleExpression>;

  let contentWithAttributes: string;
  let contentWithoutAttributes: string;

  const patterns = "data-[a-z-]+";

  suiteSetup(function() {
    expressions = expressionsFactory({ });

    contentWithAttributes = embedContentInContext(`
      <div data-foo="bar">
        <p data-style="italics">Lorem ipsum dolor ...</p>
        <img data-hello="world"/>
      </div>
    `);
    contentWithoutAttributes = `
      <h1>Title</h1>
      <p>Lorem ipsum dolor ...</p>
    `;
  });

  test("benchmark validity", function() {
    expect(expressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.1);
    const fileContent = embedContentInBody(contentWithAttributes);

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
    const largeContent = contentWithAttributes.repeat(100);
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

  test("large file without attributes", function() {
    const budget = getRuntimeBudget(1);
    const largeContent = contentWithoutAttributes.repeat(100);
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
