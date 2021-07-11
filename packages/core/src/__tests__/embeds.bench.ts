import type { IdentifiableWebManglerEmbed } from "../embeds";
import type { WebManglerFile, WebManglerLanguagePlugin } from "../types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { WebManglerLanguagePluginMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import { getEmbeds, reEmbed } from "../embeds";

suite("Core embeds", function() {
  const embedCount = 100;
  const fileSizeOrder = 10000;

  let embeds: Iterable<IdentifiableWebManglerEmbed>;
  let file: WebManglerFile;

  setup(function() {
    embeds = Array(embedCount)
      .fill(null)
      .map((_, index) => ({
        id: `embed-${index}`,
        type: "css",
        content: ".foobar { }",
        startIndex: 3,
        endIndex: 14,
        getRaw(): string { return this.content; },
      }));

    file = {
      content: "<style>.foobar { }</style>".repeat(fileSizeOrder),
      type: "html",
    };
  });

  test("getEmbeds", function() {
    const budget = getRuntimeBudget(3);

    const files: Iterable<WebManglerFile> = [file];
    const plugins: Iterable<WebManglerLanguagePlugin> = [
      new WebManglerLanguagePluginMock({
        getEmbeds: sinon.stub().returns(embeds),
      }),
    ];

    const result = benchmarkFn({
      fn: () => getEmbeds(files, plugins),
    });

    expect(result.medianDuration).to.be.below(budget);
  });

  test("reEmbed", function() {
    const budget = getRuntimeBudget(1);

    const result = benchmarkFn({
      fn: () => reEmbed(embeds, file),
    });

    expect(result.medianDuration).to.be.below(budget);
  });
});
