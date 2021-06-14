import type { WebManglerFile } from "../../../../types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import {
  embedContentInBody,
  embedContentInContext,
} from "../../__tests__/benchmark-helpers";

import manglerEngine from "../../../../engine";
import multiValueAttributeExpressionFactory from "../multi-value-attributes";

suite("HTML - Multi Value Attribute Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "[a-zA-Z0-9-]+",
  };

  const contentWithMultiValueAttribute = embedContentInContext(`
    <div class="foo bar">
      <div id="foobar">
        <p class="left">Hello</p>
        <p class="green small" data-foo="bar">World!</p>
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
    const expressions = multiValueAttributeExpressionFactory({
      attributeNames: ["class"],
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
    const fileContent = embedContentInBody(contentWithMultiValueAttribute);

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
    const budget = getRuntimeBudget(10);
    const largeContent = contentWithMultiValueAttribute.repeat(100);
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

  test("large file without multi-value attributes", function() {
    const budget = getRuntimeBudget(1);
    const largeContent = contentWithoutMultiValueAttribute.repeat(100);
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
