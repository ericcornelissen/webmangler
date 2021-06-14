import type { WebManglerFile } from "../../../../types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import {
  embedContentInBody,
  embedContentInContext,
} from "../../__tests__/benchmark-helpers";

import manglerEngine from "../../../../engine";
import attributeExpressionFactory from "../attributes";

suite("HTML - Attribute Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "data-[a-z-]+",
  };

  const contentWithAttributes = embedContentInContext(`
    <div data-foo="bar">
      <p data-style="italics">Lorem ipsum dolor ...</p>
      <img data-hello="world"/>
    </div>
  `);
  const contentWithoutAttributes = `
    <h1>Title</h1>
    <p>Lorem ipsum dolor ...</p>
  `;

  suiteSetup(function() {
    const expressions = attributeExpressionFactory();
    expressionsMap.set("html", expressions);
  });

  test("benchmark validity", function() {
    const cssExpressions = expressionsMap.get("html");
    expect(cssExpressions).not.to.be.undefined;
    expect(cssExpressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.3);
    const fileContent = embedContentInBody(contentWithAttributes);

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [{ type: "html", content: fileContent }],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).not.to.equal(fileContent);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(6);
    const largeContent = contentWithAttributes.repeat(100);
    const fileContent = embedContentInBody(largeContent);

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [{ type: "html", content: fileContent }],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).not.to.equal(fileContent);
  });

  test("large file without attributes", function() {
    const budget = getRuntimeBudget(1);
    const largeContent = contentWithoutAttributes.repeat(100);
    const fileContent = embedContentInBody(largeContent);

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [{ type: "html", content: fileContent }],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).to.equal(fileContent);
  });
});
