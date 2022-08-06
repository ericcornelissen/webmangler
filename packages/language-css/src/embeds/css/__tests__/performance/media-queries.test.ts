import type { WebManglerEmbed, WebManglerFile } from "@webmangler/types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import {
  embedContentInContext,
} from "../common";

import { getMediaQueriesAsEmbeds } from "../../media-queries";

suite("CSS - Embeds - Find Media Query Embeds", function() {
  const contentWithMediaQuery = embedContentInContext(`
    .foobar {
      color: red;
    }
    @media print {
      .foobar {
        color: blue;
      }
    }
  `);
  const contentWithoutMediaQuery = `
    .foobar {
      color: red;
    }
  `;

  test("simple file", function() {
    const budget = getRuntimeBudget(1);
    const fileContent = contentWithMediaQuery;

    let file: WebManglerFile;
    let embeds: Iterable<WebManglerEmbed> = [];
    const result = benchmarkFn({
      setup: () => file = { type: "css", content: fileContent },
      fn: () => embeds = getMediaQueriesAsEmbeds(file),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(embeds).to.have.length.greaterThan(0);
  });

  test("large file", function() {
    const budget = getRuntimeBudget(2);
    const fileContent = contentWithMediaQuery.repeat(100);

    let file: WebManglerFile;
    let embeds: Iterable<WebManglerEmbed> = [];
    const result = benchmarkFn({
      setup: () => file = { type: "css", content: fileContent },
      fn: () => embeds = getMediaQueriesAsEmbeds(file),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(embeds).to.have.length.greaterThan(0);
  });

  test("large file without a style attribute tag", function() {
    const budget = getRuntimeBudget(1);
    const fileContent = contentWithoutMediaQuery.repeat(100);

    let file: WebManglerFile;
    let embeds: Iterable<WebManglerEmbed> = [];
    const result = benchmarkFn({
      setup: () => file = { type: "css", content: fileContent },
      fn: () => embeds = getMediaQueriesAsEmbeds(file),
    });

    expect(result.medianDuration).to.be.below(budget);

    expect(embeds).to.have.length(0);
  });
});
