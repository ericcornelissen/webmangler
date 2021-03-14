import type { WebManglerFile } from "../../../types";

import { WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";

import {
  benchmarkFn,
  getRuntimeBudget,
} from "../../__tests__/benchmark-helpers";

import manglerEngine from "../../../engine";
import querySelectorExpressionFactory from "../query-selectors";

suite("CSS - Query Selector Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "[a-zA-Z0-9]+",
  };

  const contentWithQuerySelector = `
    body {
      font-family: sans-serif;
    }

    .foo[data-bar] {
      content: attr(data-foo);
    }

    .foo[data-baz]::after {
      content: "bar";
      color: #123;
    }
  `;
  const contentWithoutQuerySelector = `
    body {
      font-family: sans-serif;
    }

    #foo[data-bar] {
      content: attr(data-foo);
    }

    #foo[data-baz]::after {
      content: "bar";
      color: #123;
    }
  `;

  suiteSetup(function() {
    const expressions = querySelectorExpressionFactory({
      prefix: "\\.",
    });
    expressionsMap.set("css", expressions);
  });

  test("benchmark validity", function() {
    const cssExpressions = expressionsMap.get("css");
    expect(cssExpressions).not.to.be.undefined;
    expect(cssExpressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.1);
    const fileContent = contentWithQuerySelector;

    let files: WebManglerFile[] = [];
    let mangledFiles: WebManglerFile[] = [];
    const result = benchmarkFn(() => {
      files = [new WebManglerFileMock("css", fileContent)];
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
    const budget = getRuntimeBudget(10);
    const fileContent = contentWithQuerySelector.repeat(100);

    let files: WebManglerFile[] = [];
    let mangledFiles: WebManglerFile[] = [];
    const result = benchmarkFn(() => {
      files = [new WebManglerFileMock("css", fileContent)];
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

  test("large file without query selectors", function() {
    const budget = getRuntimeBudget(10);
    const fileContent = contentWithoutQuerySelector.repeat(100);

    let files: WebManglerFile[] = [];
    let mangledFiles: WebManglerFile[] = [];
    const result = benchmarkFn(() => {
      files = [new WebManglerFileMock("css", fileContent)];
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
