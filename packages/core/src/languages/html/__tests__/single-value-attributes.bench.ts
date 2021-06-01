import type { WebManglerFile } from "../../../types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import { embedContentInBody, embedContentInContext } from "./benchmark-helpers";

import manglerEngine from "../../../engine";
import singleValueAttributeExpressionFactory from "../single-value-attributes";

suite("HTML - Single Value Attribute Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "[a-zA-Z0-9-]+",
  };

  const contentWithSingleValueAttribute = embedContentInContext(`
    <div class="foo bar">
      <form id="foobar">
        <label for="input" data-foo="bar">Username</label>
        <input id="input"/>
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
    const expressions = singleValueAttributeExpressionFactory({
      attributeNames: ["id", "for"],
    });
    expressionsMap.set("html", expressions);
  });

  test("benchmark validity", function() {
    const cssExpressions = expressionsMap.get("html");
    expect(cssExpressions).not.to.be.undefined;
    expect(cssExpressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.3);
    const fileContent = embedContentInBody(contentWithSingleValueAttribute);

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
    const largeContent = contentWithSingleValueAttribute.repeat(100);
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

  test("large file without single-value attributes", function() {
    const budget = getRuntimeBudget(1);
    const largeContent = contentWithoutSingleValueAttribute.repeat(100);
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
