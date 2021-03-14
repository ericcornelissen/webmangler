import type { WebManglerFile } from "../../../types";

import { WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";

import {
  benchmarkFn,
  getRuntimeBudget,
} from "../../__tests__/benchmark-helpers";

import manglerEngine from "../../../engine";
import querySelectorExpressionFactory from "../query-selectors";

suite("JavaScript - Query Selector Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "[a-zA-Z0-9-]+",
  };

  const contentWithQuerySelector = `
    const div = document.querySelectorAll("div");
    const foo = document.querySelectorAll(".foo");
    const bar = document.querySelectorAll("#bar");
  `;
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
    const budget = getRuntimeBudget(0.1);
    const fileContent = contentWithQuerySelector;

    let files: WebManglerFile[] = [];
    let mangledFiles: WebManglerFile[] = [];
    const result = benchmarkFn(() => {
      files = [new WebManglerFileMock("js", fileContent)];
      mangledFiles = manglerEngine(
        files,
        expressionsMap,
        mangleEngineOptions,
      );
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(mangledFiles).to.have.lengthOf(1);
    expect(mangledFiles[0].content).to.not.equal(fileContent);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(45);
    const fileContent = contentWithQuerySelector.repeat(100);

    let files: WebManglerFile[] = [];
    let mangledFiles: WebManglerFile[] = [];
    const result = benchmarkFn(() => {
      files = [new WebManglerFileMock("js", fileContent)];
      mangledFiles = manglerEngine(
        files,
        expressionsMap,
        mangleEngineOptions,
      );
    }, 100);

    expect(result.medianDuration).to.be.below(budget);

    expect(mangledFiles).to.have.lengthOf(1);
    expect(mangledFiles[0].content).to.not.equal(fileContent);
  });

  test("large file without query selectors", function() {
    const budget = getRuntimeBudget(30);
    const fileContent = contentWithoutQuerySelector.repeat(100);

    let files: WebManglerFile[] = [];
    let mangledFiles: WebManglerFile[] = [];
    const result = benchmarkFn(() => {
      files = [new WebManglerFileMock("js", fileContent)];
      mangledFiles = manglerEngine(
        files,
        expressionsMap,
        mangleEngineOptions,
      );
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(mangledFiles).to.have.lengthOf(1);
    expect(mangledFiles[0].content).not.equal(fileContent);
  });
});
