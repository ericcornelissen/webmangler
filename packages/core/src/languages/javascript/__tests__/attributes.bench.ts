import type { WebManglerFile } from "../../../types";

import { expect } from "chai";

import WebManglerFileMock from "../../../__mocks__/web-mangler-file.mock";
import {
  benchmarkFn,
  getRuntimeBudget,
} from "../../__tests__/benchmark-helpers";

import manglerEngine from "../../../engine";
import attributeExpressionFactory from "../attributes";

suite("JavaScript - Attribute Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "foo[a-zA-Z0-9]+",
  };

  const contentWithAttributes = `
    const foo = document.querySelectorAll("[data-foo]");
    const bar = document.querySelector("[data-bar]");
  `;

  suiteSetup(function() {
    const expressions = attributeExpressionFactory();
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
      new WebManglerFileMock("js", contentWithAttributes),
    ];

    const result = benchmarkFn(() => {
      manglerEngine(files, expressionsMap, mangleEngineOptions);
    });

    expect(result.medianDuration).to.be.below(budget);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(10);

    const files: WebManglerFile[] = [
      new WebManglerFileMock("js", contentWithAttributes.repeat(100)),
    ];

    const result = benchmarkFn(() => {
      manglerEngine(files, expressionsMap, mangleEngineOptions);
    });

    expect(result.medianDuration).to.be.below(budget);
  });
});
