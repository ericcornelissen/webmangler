import type { WebManglerFile } from "../../../../types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import { embedContentInContext } from "./benchmark-helpers";

import manglerEngine from "../../../../engine";
import cssDeclarationPropertyExpressionFactory from "../css-properties";

suite("JavaScript - CSS Property Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "[a-zA-Z0-9-]+",
  };

  const contentWithProperties = embedContentInContext(`
    $element.style.getPropertyValue("--color");
    $element.style.getPropertyValue("--font-size");
    $element.style.getPropertyValue("--margin-left");
  `);
  const contentWithoutProperties = `
    const foo = "bar";
    const fooEl = document.getElementById(foo);
    const barEl = document.querySelector(".bar");
  `;

  suiteSetup(function() {
    const expressions = cssDeclarationPropertyExpressionFactory({
      prefix: "--",
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
    const fileContent = contentWithProperties;

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [{ type: "js", content: fileContent }],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).not.to.equal(fileContent);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(6);
    const fileContent = contentWithProperties.repeat(100);

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [{ type: "js", content: fileContent }],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).not.to.equal(fileContent);
  });

  test("large file without properties", function() {
    const budget = getRuntimeBudget(1);
    const fileContent = contentWithoutProperties.repeat(100);

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [{ type: "js", content: fileContent }],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).to.equal(fileContent);
  });
});
