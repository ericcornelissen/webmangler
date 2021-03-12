import type { WebManglerFile } from "../../../types";

import { expect } from "chai";

import WebManglerFileMock from "../../../__mocks__/web-mangler-file.mock";
import {
  benchmarkFn,
  getRuntimeBudget,
} from "../../__tests__/benchmark-helpers";

import manglerEngine from "../../../engine";
import attributeExpressionFactory from "../attributes";

suite("HTML - Attribute Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "foo[a-zA-Z0-9]+",
  };

  const contentWithAttributes = `
    <body data-foo="bar">
      <h1 id="title">Title</h1>
      <p data-style="italics">Lorem ipsum dolor ...</p>
    </body>
  `;

  suiteSetup(function() {
    const expressions = attributeExpressionFactory();
    expressionsMap.set("html", expressions);
  });

  test("benchmark validity", function() {
    const cssExpressions = expressionsMap.get("html");
    expect(cssExpressions).not.to.be.undefined;
    expect(cssExpressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.1);

    const files: WebManglerFile[] = [
      new WebManglerFileMock("html", contentWithAttributes),
    ];

    const result = benchmarkFn(() => {
      manglerEngine(files, expressionsMap, mangleEngineOptions);
    });

    expect(result.medianDuration).to.be.below(budget);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(10);

    const files: WebManglerFile[] = [
      new WebManglerFileMock("html", contentWithAttributes.repeat(100)),
    ];

    const result = benchmarkFn(() => {
      manglerEngine(files, expressionsMap, mangleEngineOptions);
    });

    expect(result.medianDuration).to.be.below(budget);
  });
});
