import type { WebManglerFile } from "../../../types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";

import { embedContentInBody, embedContentInContext } from "./benchmark-helpers";

import manglerEngine from "../../../engine";
import cssDeclarationPropertyExpressionFactory from "../css-properties";

suite("HTML - CSS Property Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "[a-zA-Z0-9-]+",
  };

  const contentWithVariables = embedContentInContext(`
    <div style="--color: red">
      <p style="color: var(--color); --font: sans-serif">Hello world!</p>
    </div>
  `);
  const contentWithoutVariables = `
    <div style="color: red">
      <p>Hello world!</p>
    </div>
  `;

  suiteSetup(function() {
    const expressions = cssDeclarationPropertyExpressionFactory({
      prefix: "--",
    });
    expressionsMap.set("html", expressions);
  });

  test("benchmark validity", function() {
    const cssExpressions = expressionsMap.get("html");
    expect(cssExpressions).not.to.be.undefined;
    expect(cssExpressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.3);
    const fileContent = embedContentInBody(contentWithVariables);

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
    const budget = getRuntimeBudget(6);
    const largeContent = contentWithVariables.repeat(100);
    const fileContent = embedContentInBody(largeContent);

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

  test("large file without variables", function() {
    const budget = getRuntimeBudget(1);
    const largeContent = contentWithoutVariables.repeat(100);
    const fileContent = embedContentInBody(largeContent);

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
