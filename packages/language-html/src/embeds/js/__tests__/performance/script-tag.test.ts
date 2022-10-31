import type { WebManglerEmbed, WebManglerFile } from "@webmangler/types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import {
  embedContentInBody,
  embedContentInContext,
} from "../common";

import { getScriptTagsAsEmbeds } from "../../script-tag";

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

    let file: Readonly<WebManglerFile>;
    let embeds: Iterable<WebManglerEmbed> = [];
    const result = benchmarkFn({
      setup: () => file = { type: "html", content: fileContent },
      fn: () => embeds = getScriptTagsAsEmbeds(file),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(embeds).to.have.length.greaterThan(0);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(2);
    const largeContent = contentWithScriptTags.repeat(100);
    const fileContent = embedContentInBody(largeContent);

    let file: Readonly<WebManglerFile>;
    let embeds: Iterable<WebManglerEmbed> = [];
    const result = benchmarkFn({
      setup: () => file = { type: "html", content: fileContent },
      fn: () => embeds = getScriptTagsAsEmbeds(file),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(embeds).to.have.length.greaterThan(0);
  });

  test("large file without a <script> tag", function() {
    const budget = getRuntimeBudget(1);
    const largeContent = contentWithoutScriptTags.repeat(100);
    const fileContent = embedContentInBody(largeContent);

    let file: Readonly<WebManglerFile>;
    let embeds: Iterable<WebManglerEmbed> = [];
    const result = benchmarkFn({
      setup: () => file = { type: "html", content: fileContent },
      fn: () => embeds = getScriptTagsAsEmbeds(file),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(embeds).to.have.length(0);
  });
});
