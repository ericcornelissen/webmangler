import type { WebManglerFile } from "../../../types";

import { expect } from "chai";

import WebManglerFileMock from "../../../__mocks__/web-mangler-file.mock";
import {
  benchmarkFn,
  getRuntimeBudget,
} from "../../__tests__/benchmark-helpers";

import manglerEngine from "../../../engine";
import multiValueAttributeExpressionFactory from "../multi-value-attributes";

suite("HTML - Multi Value Attribute Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "[a-zA-Z0-9-]+",
  };

  const contentWithMultiValueAttribute = `
    <body class="foo bar">
      <div id="foobar">
        <p class="left">Hello</p>
        <p class="green small" data-foo="bar">World!</p>
      </div>
    </body>
  `;
  const contentWithoutMultiValueAttribute = `
    <body id="foo">
      <div id="bar">
        <p>Hello world!</p>
      </div>
    </body>
  `;

  suiteSetup(function() {
    const expressions = multiValueAttributeExpressionFactory({
      attributeNames: ["class"],
    });
    expressionsMap.set("html", expressions);
  });

  test("benchmark validity", function() {
    const cssExpressions = expressionsMap.get("html");
    expect(cssExpressions).not.to.be.undefined;
    expect(cssExpressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.1);
    const fileContent = contentWithMultiValueAttribute;

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
    const fileContent = contentWithMultiValueAttribute.repeat(100);

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

  test("large file without multi-value attributes", function() {
    const budget = getRuntimeBudget(10);
    const fileContent = contentWithoutMultiValueAttribute.repeat(100);

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
