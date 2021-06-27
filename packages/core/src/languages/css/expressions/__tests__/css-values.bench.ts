import type { WebManglerFile } from "../../../../types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import { embedContentInContext } from "./benchmark-helpers";

import manglerEngine from "../../../../engine";
import cssDeclarationValueExpressionFactory from "../css-values";

suite("CSS - CSS Value Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "[a-zA-Z0-9-]+",
  };

  const contentWithVariables = embedContentInContext(`
    #foobar {
      content: var(--foobar);
    }

    .foo {
      content: var(--bar);
    }

    .bar::after {
      content: var(--foo);
    }
  `);
  const contentWithoutVariables = `
    #foobar {
      content: "foobar";
    }

    .foo {
      content: "bar";
    }

    .bar::after {
      content: "foo";
    }
  `;

  suiteSetup(function() {
    const expressions = cssDeclarationValueExpressionFactory({
      prefix: "var\\(--",
      suffix: "\\)",
    });
    expressionsMap.set("css", expressions);
  });

  test("benchmark validity", function() {
    const cssExpressions = expressionsMap.get("css");
    expect(cssExpressions).not.to.be.undefined;
    expect(cssExpressions).to.have.length.above(0);
  });

  test("simple file", function() {
    const budget = getRuntimeBudget(0.3);
    const fileContent = contentWithVariables;

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [{ type: "css", content: fileContent }],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).not.to.equal(fileContent);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(6);
    const fileContent = contentWithVariables.repeat(100);

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [{ type: "css", content: fileContent }],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).not.to.equal(fileContent);
  });

  test("large file without variables", function() {
    const budget = getRuntimeBudget(1);
    const fileContent = contentWithoutVariables.repeat(100);

    let files: WebManglerFile[] = [];
    const result = benchmarkFn({
      setup: () => files = [{ type: "css", content: fileContent }],
      fn: () => manglerEngine(files, expressionsMap, mangleEngineOptions),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(files).to.have.lengthOf(1);
    expect(files[0].content).to.equal(fileContent);
  });
});
