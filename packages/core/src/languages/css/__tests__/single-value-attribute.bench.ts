import type { WebManglerFile } from "../../../types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";

import { embedContentInContext } from "./benchmark-helpers";

import manglerEngine from "../../../engine";
import singleValueAttributeExpressionFactory from "../single-value-attributes";

suite("CSS - Single Value Attribute Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "[a-zA-Z0-9-]+",
  };

  const contentWithSingleValueAttribute = embedContentInContext(`
    input[id="bar"] {
      font-family: sans-serif;
    }

    .foo[for="bar"] {
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
    const expressions = singleValueAttributeExpressionFactory({
      attributeNames: ["id", "for"],
    });
    expressionsMap.set("css", expressions);
  });

  test("benchmark validity", function() {
    const cssExpressions = expressionsMap.get("css");
    expect(cssExpressions).not.to.be.undefined;
    expect(cssExpressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.3);
    const fileContent = contentWithSingleValueAttribute;

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [new WebManglerFileMock("css", fileContent)],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).not.to.equal(fileContent);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(6);
    const fileContent = contentWithSingleValueAttribute.repeat(100);

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [new WebManglerFileMock("css", fileContent)],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).not.to.equal(fileContent);
  });

  test("large file without single-value attributes", function() {
    const budget = getRuntimeBudget(1);
    const fileContent = contentWithoutSingleValueAttribute.repeat(100);

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [new WebManglerFileMock("css", fileContent)],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).to.equal(fileContent);
  });
});
