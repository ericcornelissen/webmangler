import type { TestScenario } from "@webmangler/testing";

import type { TestCase } from "../../__test__/types";

import { WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";

import { getStyleAttributesAsEmbeds } from "../style-attribute";

const EMBED_TYPE_CSS = "css";

suite("HTML CSS Embeds - Style attribute", function() {
  const prepareContent = (s: string): string => `:root{${s}}`;

  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          file: new WebManglerFileMock(
            "html",
            "<div style=\"color: red;\"><div>",
          ),
          expected: [
            {
              content: prepareContent("color: red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 12,
              endIndex: 23,
              getRaw(): string { return "color: red;"; },
            },
          ],
        },
        {
          file: new WebManglerFileMock(
            "html",
            "<html>" +
            "<head>" +
            "<div style=\"color: red;\"></div>" +
            "<p style=\"font: serif;\"></p>" +
            "</head>" +
            "</html>",
          ),
          expected: [
            {
              content: prepareContent("color: red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 24,
              endIndex: 35,
              getRaw(): string { return "color: red;"; },
            },
            {
              content: prepareContent("font: serif;"),
              type: EMBED_TYPE_CSS,
              startIndex: 53,
              endIndex: 65,
              getRaw(): string { return "font: serif;"; },
            },
          ],
        },
      ],
    },
    {
      name: "edge cases",
      cases: [
        {
          file: new WebManglerFileMock("html", "<div>foobar</div>"),
          expected: [],
        },
      ],
    },
  ];

  for (const { name, cases } of scenarios) {
    test(name, function() {
      for (const testCase of cases) {
        const { expected, file } = testCase;

        const embeds = getStyleAttributesAsEmbeds(file);
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
