import type {
  Collection,
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

import type { IdentifiableWebManglerEmbed } from "../../types";

import { benchmarkFn, getRuntimeBudget } from "@webmangler/benchmarking";
import { WebManglerLanguagePluginMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import { getEmbeds } from "../../extract";

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
    const budget = getRuntimeBudget(6);

    const getEmbedsStub = sinon.stub();

    const files: Collection<WebManglerFile> = [file];
    const plugins: Collection<WebManglerLanguagePlugin> = [
      new WebManglerLanguagePluginMock({
        getEmbeds: getEmbedsStub,
      }),
    ];

    const result = benchmarkFn({
      setup: () => {
        getEmbedsStub.reset();
        getEmbedsStub.onFirstCall().returns(embeds);
        getEmbedsStub.returns([]);
      },
      fn: () => getEmbeds(files, plugins),
    });

    expect(result.medianDuration).to.be.below(budget);
  });
});
