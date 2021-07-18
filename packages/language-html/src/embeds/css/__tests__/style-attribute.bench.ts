import type { WebManglerEmbed, WebManglerFile } from "@webmangler/types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import {
  embedContentInBody,
  embedContentInContext,
} from "../../../__tests__/benchmark-helpers";

import { getStyleAttributesAsEmbeds } from "../style-attribute";

suite("CSS - Embeds - Find Style Attribute Embeds", function() {
  const contentWithStyleTags = embedContentInContext(`
    <div style="background: red;">
      <h1 style="font: serif;">Hello world!</h1>
      <hr/>
      <p> style="color: blue;">
        Lorem <span>ipsum</span> dolor...
      </p>
    <div>
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
      setup: () => file = { type: "html", content: fileContent },
      fn: () => embeds = getStyleAttributesAsEmbeds(file),
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
      setup: () => file = { type: "html", content: fileContent },
      fn: () => embeds = getStyleAttributesAsEmbeds(file),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(embeds).to.have.length.greaterThan(0);
  });

  test("large file without a style attribute tag", function() {
    const budget = getRuntimeBudget(1);
    const largeContent = contentWithoutStyleTags.repeat(100);
    const fileContent = embedContentInBody(largeContent);

    let file: WebManglerFile;
    let embeds: Iterable<WebManglerEmbed> = [];
    const result = benchmarkFn({
      setup: () => file = { type: "html", content: fileContent },
      fn: () => embeds = getStyleAttributesAsEmbeds(file),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(embeds).to.have.length(0);
  });
});
