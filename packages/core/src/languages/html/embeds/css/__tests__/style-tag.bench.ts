import type { WebManglerEmbed, WebManglerFile } from "../../../../../types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";

import {
  embedContentInBody,
  embedContentInContext,
} from "../../../__tests__/benchmark-helpers";

import { getStyleTagsAsEmbeds } from "../style-tag";

suite("CSS - Embeds - Find <style> Tag Embeds", function() {
  const contentWithStyleTags = embedContentInContext(`
    <style>
    a[target="_blank"] {
      text-decoration: underline;
    }

    #foo {
      color: red;
    }

    .bar {
      font: serif;
    }
    </style>
  `);
  const contentWithoutStyleTags = `
    <h1>Title</h1>
    <p>Lorem ipsum dolor ...</p>
  `;

  test("simple file", function() {
    const budget = getRuntimeBudget(1);
    const fileContent = embedContentInBody(contentWithStyleTags);

    let file: WebManglerFile;
    let embeds: Iterable<WebManglerEmbed> = [];
    const result = benchmarkFn({
      setup: () => file = new WebManglerFileMock("html", fileContent),
      fn: () => embeds = getStyleTagsAsEmbeds(file),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(embeds).to.have.length.greaterThan(0);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(2);
    const largeContent = contentWithStyleTags.repeat(100);
    const fileContent = embedContentInBody(largeContent);

    let file: WebManglerFile;
    let embeds: Iterable<WebManglerEmbed> = [];
    const result = benchmarkFn({
      setup: () => file = new WebManglerFileMock("html", fileContent),
      fn: () => embeds = getStyleTagsAsEmbeds(file),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(embeds).to.have.length.greaterThan(0);
  });

  test("large file without a <style> tag", function() {
    const budget = getRuntimeBudget(1);
    const largeContent = contentWithoutStyleTags.repeat(100);
    const fileContent = embedContentInBody(largeContent);

    let file: WebManglerFile;
    let embeds: Iterable<WebManglerEmbed> = [];
    const result = benchmarkFn({
      setup: () => file = new WebManglerFileMock("html", fileContent),
      fn: () => embeds = getStyleTagsAsEmbeds(file),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(embeds).to.have.length(0);
  });
});
