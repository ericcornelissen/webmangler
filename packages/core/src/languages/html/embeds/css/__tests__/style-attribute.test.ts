import type { TestScenario } from "@webmangler/testing";

import type { TestCase } from "../../__tests__/types";

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
          file: {
            type: "html",
            content: "<div style=\"color: red;\"><div>",
          },
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
          file: {
            type: "html",
            content: "<div disabled style=\"color: blue;\"><div>",
          },
          expected: [
            {
              content: prepareContent("color: blue;"),
              type: EMBED_TYPE_CSS,
              startIndex: 21,
              endIndex: 33,
              getRaw(): string { return "color: blue;"; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<div id=\"foobar\" style=\"color: blue;\"><div>",
          },
          expected: [
            {
              content: prepareContent("color: blue;"),
              type: EMBED_TYPE_CSS,
              startIndex: 24,
              endIndex: 36,
              getRaw(): string { return "color: blue;"; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<html>" +
              "<head>" +
              "<div style=\"color: red;\"></div>" +
              "<p style=\"font: serif;\"></p>" +
              "</head>" +
              "</html>",
          },
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
      name: "no quotes",
      cases: [
        {
          file: {
            type: "html",
            content: "<div style=color:red;><div>",
          },
          expected: [
            {
              content: prepareContent("color:red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 11,
              endIndex: 21,
              getRaw(): string { return "color:red;"; },
            },
          ],
        },
      ],
    },
    {
      name: "comments",
      cases: [
        {
          file: {
            type: "html",
            content: "<!--<div style=\"color: red;\"><div>-->",
          },
          expected: [],
        },
        {
          file: {
            type: "html",
            content: "<!--<div style=color:red;><div>-->",
          },
          expected: [],
        },
        {
          file: {
            type: "html",
            content: "<!--<div style=\"color: red;\"><div>-->" +
              "<div style=\"color: red;\"><div>",
          },
          expected: [
            {
              content: prepareContent("color: red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 49,
              endIndex: 60,
              getRaw(): string { return "color: red;"; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<div style=\"color: red;\"><div>" +
              "<!--<div style=\"color: red;\"><div>-->",
          },
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
      ],
    },
    {
      name: "edge cases",
      cases: [
        {
          file: {
            type: "html",
            content: "<div>foobar</div>",
          },
          expected: [],
        },
        {
          file: {
            type: "html",
            content: "<div style=\"\">foobar</div>",
          },
          expected: [],
        },
        {
          file: {
            type: "html",
            content: "<div style=\" \">foobar</div>",
          },
          expected: [
            {
              content: prepareContent(" "),
              type: EMBED_TYPE_CSS,
              startIndex: 12,
              endIndex: 13,
              getRaw(): string { return " "; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<div style=\"color: red;\" style=\"font: serif;\"><div>",
          },
          expected: [
            {
              content: prepareContent("color: red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 12,
              endIndex: 23,
              getRaw(): string { return "color: red;"; },
            },
            {
              content: prepareContent("font: serif;"),
              type: EMBED_TYPE_CSS,
              startIndex: 32,
              endIndex: 44,
              getRaw(): string { return "font: serif;"; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<div data-value=\">\" style=\"color: red;\"><div>",
          },
          expected: [
            {
              content: prepareContent("color: red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 27,
              endIndex: 38,
              getRaw(): string { return "color: red;"; },
            },
          ],
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
