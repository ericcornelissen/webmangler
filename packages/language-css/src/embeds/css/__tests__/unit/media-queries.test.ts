import type { TestScenarios } from "@webmangler/testing";

import type { TestCase } from "../common";

import { expect } from "chai";

import { getMediaQueriesAsEmbeds } from "../../media-queries";

const EMBED_TYPE_CSS = "css";

suite("CSS CSS Embeds - Media queries", function() {
  const scenarios: TestScenarios<TestCase[]> = [
    {
      testName: "sample",
      getScenario: () => [
        {
          file: {
            type: "css",
            content: "@media screen { .foobar{color:red;} }",
          },
          expected: [
            {
              content: " .foobar{color:red;}",
              type: EMBED_TYPE_CSS,
              startIndex: 17,
              endIndex: 36,
              getRaw(): string { return " .foobar{color:red;}"; },
            },
          ],
        },
      ],
    },
  ];

  for (const { getScenario, testName } of scenarios) {
    test(testName, function() {
      for (const testCase of getScenario()) {
        const { expected, file } = testCase;

        const embeds = getMediaQueriesAsEmbeds(file);
        expect(embeds).to.have.length(expected.length);

        Array.from(embeds).forEach((embed, i) => {
          const expectedEmbed = expected[i];
          expect(embed.content).to.equal(expectedEmbed.content);
          expect(embed.type).to.equal(expectedEmbed.type);
          expect(embed.startIndex).to.equal(expectedEmbed.startIndex);
          expect(embed.endIndex).to.equal(expectedEmbed.endIndex);
          expect(embed.getRaw()).to.equal(expectedEmbed.getRaw());
        });
      }
    });
  }
});
