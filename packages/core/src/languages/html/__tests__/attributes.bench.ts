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
    patterns: "data-[a-z-]+",
  };

  const contentWithAttributes = `
    <body data-foo="bar">
      <h1 id="title">Title</h1>
      <p data-style="italics">Lorem ipsum dolor ...</p>
    </body>
  `;
  const contentWithoutAttributes = `
    <body>
      <h1>Title</h1>
      <p>Lorem ipsum dolor ...</p>
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
    const fileContent = contentWithAttributes;

    let files: WebManglerFile[] = [];
    let mangledFiles: WebManglerFile[] = [];
    const result = benchmarkFn(() => {
      files = [new WebManglerFileMock("html", fileContent)];
      mangledFiles = manglerEngine(
        files,
        expressionsMap,
        mangleEngineOptions,
      );
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(mangledFiles).to.have.lengthOf(1);
    expect(mangledFiles[0].content).not.to.equal(fileContent);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(10);
    const fileContent = contentWithAttributes.repeat(100);

    let files: WebManglerFile[] = [];
    let mangledFiles: WebManglerFile[] = [];
    const result = benchmarkFn(() => {
      files = [new WebManglerFileMock("html", fileContent)];
      mangledFiles = manglerEngine(
        files,
        expressionsMap,
        mangleEngineOptions,
      );
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(mangledFiles).to.have.lengthOf(1);
    expect(mangledFiles[0].content).not.to.equal(fileContent);
  });

  test("large file without attributes", function() {
    const budget = getRuntimeBudget(10);
    const fileContent = contentWithoutAttributes.repeat(100);

    let files: WebManglerFile[] = [];
    let mangledFiles: WebManglerFile[] = [];
    const result = benchmarkFn(() => {
      files = [new WebManglerFileMock("html", fileContent)];
      mangledFiles = manglerEngine(
        files,
        expressionsMap,
        mangleEngineOptions,
      );
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(mangledFiles).to.have.lengthOf(1);
    expect(mangledFiles[0].content).to.equal(fileContent);
  });
});
