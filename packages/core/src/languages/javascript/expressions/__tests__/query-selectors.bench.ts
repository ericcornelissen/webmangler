import type { WebManglerFile } from "../../../../types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import { embedContentInContext } from "./benchmark-helpers";

import manglerEngine from "../../../../engine";
import querySelectorExpressionFactory from "../query-selectors";

suite("JavaScript - Query Selector Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "[a-zA-Z0-9-]+",
  };

  const contentWithQuerySelector = embedContentInContext(`
    const div = document.querySelectorAll("div");
    const foo = document.querySelectorAll(".foo");
    const bar = document.querySelectorAll("#bar");
  `);
  const contentWithoutQuerySelector = `
    const foo = "bar";
    const fooEl = document.getElementById(foo);
  `;

  suiteSetup(function() {
    const expressions = querySelectorExpressionFactory({
      prefix: "\\.",
    });
    expressionsMap.set("js", expressions);
  });

  test("benchmark validity", function() {
    const cssExpressions = expressionsMap.get("js");
    expect(cssExpressions).not.to.be.undefined;
    expect(cssExpressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.3);
    const fileContent = contentWithQuerySelector;

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [{ type: "js", content: fileContent }],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).to.not.equal(fileContent);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(6);
    const fileContent = contentWithQuerySelector.repeat(100);

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [{ type: "js", content: fileContent }],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).to.not.equal(fileContent);
  });

  test("large file without query selectors", function() {
    const budget = getRuntimeBudget(1);
    const fileContent = contentWithoutQuerySelector.repeat(100);

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [{ type: "js", content: fileContent }],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).not.equal(fileContent);
  });
});
