import type { WebManglerEmbed, WebManglerFile } from "../../../../../types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";

import {
  embedContentInBody,
  embedContentInContext,
} from "../../../__tests__/benchmark-helpers";

import { getScriptTagsAsEmbeds } from "../script-tag";

suite("HTML - Embeds - Find <script> Tag Embeds", function() {
  const contentWithScriptTags = embedContentInContext(`
    <script>
    var button = document.getElementById("button");
    ar elements = document.querySelectorAll(".item");
    button.addEventListener("click", function() {
      elements.forEach(element => element.classList.add("foo"));
      console.log("bar");
    });
    </script>
  `);
  const contentWithoutScriptTags = `
    <h1>Title</h1>
    <p>Lorem ipsum dolor ...</p>
  `;

  test("simple file", function() {
    const budget = getRuntimeBudget(1);
    const fileContent = embedContentInBody(contentWithScriptTags);

    let file: WebManglerFile;
    let embeds: Iterable<WebManglerEmbed> = [];
    const result = benchmarkFn({
      setup: () => file = new WebManglerFileMock("html", fileContent),
      fn: () => embeds = getScriptTagsAsEmbeds(file),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(embeds).to.have.length.greaterThan(0);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(2);
    const largeContent = contentWithScriptTags.repeat(100);
    const fileContent = embedContentInBody(largeContent);

    let file: WebManglerFile;
    let embeds: Iterable<WebManglerEmbed> = [];
    const result = benchmarkFn({
      setup: () => file = new WebManglerFileMock("html", fileContent),
      fn: () => embeds = getScriptTagsAsEmbeds(file),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(embeds).to.have.length.greaterThan(0);
  });

  test("large file without a <script> tag", function() {
    const budget = getRuntimeBudget(1);
    const largeContent = contentWithoutScriptTags.repeat(100);
    const fileContent = embedContentInBody(largeContent);

    let file: WebManglerFile;
    let embeds: Iterable<WebManglerEmbed> = [];
    const result = benchmarkFn({
      setup: () => file = new WebManglerFileMock("html", fileContent),
      fn: () => embeds = getScriptTagsAsEmbeds(file),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(embeds).to.have.length(0);
  });
});
