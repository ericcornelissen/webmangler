import type { WebManglerFile } from "../../../types";

import { expect } from "chai";

import WebManglerFileMock from "../../../__mocks__/web-mangler-file.mock";
import {
  benchmarkFn,
  getRuntimeBudget,
} from "../../__tests__/benchmark-helpers";

import manglerEngine from "../../../engine";
import attributeExpressionFactory from "../attributes";

suite("CSS - Attribute Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "foo[a-zA-Z0-9]+",
  };

  const contentWithAttributes = `
    body {
      font-family: sans-serif;
    }

    [data-foo] {
      content: attr(data-foo);
    }

    .foo[data-bar]::after {
      content: "bar";
      color: #123;
    }
  `;

  suiteSetup(function() {
    const expressions = attributeExpressionFactory();
    expressionsMap.set("css", expressions);
  });

  test("benchmark validity", function() {
    const cssExpressions = expressionsMap.get("css");
    expect(cssExpressions).not.to.be.undefined;
    expect(cssExpressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.2);

    const files: WebManglerFile[] = [
      new WebManglerFileMock("css", contentWithAttributes),
    ];

    const result = benchmarkFn(() => {
      manglerEngine(files, expressionsMap, mangleEngineOptions);
    });

    expect(result.medianDuration).to.be.below(budget);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(10);

    const files: WebManglerFile[] = [
      new WebManglerFileMock("css", contentWithAttributes.repeat(100)),
    ];

    const result = benchmarkFn(() => {
      manglerEngine(files, expressionsMap, mangleEngineOptions);
    });

    expect(result.medianDuration).to.be.below(budget);
  });
});
