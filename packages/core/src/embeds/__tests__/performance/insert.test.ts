import type { WebManglerFile } from "@webmangler/types";

import type { IdentifiableWebManglerEmbed } from "../../types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { expect } from "chai";

import { reEmbed } from "../../insert";

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

  test("reEmbed", function() {
    const budget = getRuntimeBudget(1);

    const result = benchmarkFn({
      fn: () => reEmbed(embeds, file),
    });

    expect(result.medianDuration).to.be.below(budget);
  });
});
