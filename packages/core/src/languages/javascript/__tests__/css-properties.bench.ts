import type { WebManglerFile } from "../../../types";

import { expect } from "chai";

import WebManglerFileMock from "../../../__mocks__/web-mangler-file.mock";
import {
  benchmarkFn,
  getRuntimeBudget,
  readFile,
} from "../../__tests__/benchmark-helpers";

import manglerEngine from "../../../engine";
import cssDeclarationPropertyExpressionFactory from "../css-properties";

suite("JavaScript - CSS Property Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "foo[a-zA-Z0-9]+",
  };

  let testFileContent = "";

  suiteSetup(function() {
    const expressions = cssDeclarationPropertyExpressionFactory({
      prefix: "--",
    });
    expressionsMap.set("js", expressions);

    testFileContent = readFile("sample.js");
  });

  test("benchmark validity", function() {
    expect(testFileContent).to.have.length.above(0);

    const cssExpressions = expressionsMap.get("js");
    expect(cssExpressions).not.to.be.undefined;
    expect(cssExpressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.1);

    const files: WebManglerFile[] = [
      new WebManglerFileMock("js", testFileContent),
    ];

    const result = benchmarkFn(() => {
      manglerEngine(files, expressionsMap, mangleEngineOptions);
    });

    expect(result.medianDuration).to.be.below(budget);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(10);

    const files: WebManglerFile[] = [
      new WebManglerFileMock("js", testFileContent.repeat(100)),
    ];

    const result = benchmarkFn(() => {
      manglerEngine(files, expressionsMap, mangleEngineOptions);
    });

    expect(result.medianDuration).to.be.below(budget);
  });
});
