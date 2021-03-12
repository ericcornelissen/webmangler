import type { WebManglerFile } from "../../../types";

import { expect } from "chai";

import WebManglerFileMock from "../../../__mocks__/web-mangler-file.mock";
import {
  benchmarkFn,
  getRuntimeBudget,
} from "../../__tests__/benchmark-helpers";

import manglerEngine from "../../../engine";
import querySelectorExpressionFactory from "../query-selectors";

suite("JavaScript - Query Selector Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "foo[a-zA-Z0-9]+",
  };

  const contentWithQuerySelector = `
    const div = document.querySelectorAll("div");
    const foo = document.querySelectorAll(".foo");
    const bar = document.querySelectorAll("#bar");
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

    const files: WebManglerFile[] = [
      new WebManglerFileMock("js", contentWithQuerySelector),
    ];

    const result = benchmarkFn(() => {
      manglerEngine(files, expressionsMap, mangleEngineOptions);
    });

    expect(result.medianDuration).to.be.below(budget);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(30);

    const files: WebManglerFile[] = [
      new WebManglerFileMock("js", contentWithQuerySelector.repeat(100)),
    ];

    const result = benchmarkFn(() => {
      manglerEngine(files, expressionsMap, mangleEngineOptions);
    });

    expect(result.medianDuration).to.be.below(budget);
  });
});
