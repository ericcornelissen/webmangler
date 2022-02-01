import type { TestScenarios } from "@webmangler/testing";

import type { TestCase } from "../common";

import { expect } from "chai";

import { getStyleAttributesAsEmbeds } from "../../style-attribute";

const EMBED_TYPE_CSS = "css";

suite("HTML CSS Embeds - Style attribute", function() {
  const prepareContent = (s: string): string => `:root{${s}}`;

  const scenarios: TestScenarios<TestCase[]> = [
    {
      testName: "sample",
      getScenario: () => [
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
            content: "<div style =\"color: red;\"><div>",
          },
          expected: [
            {
              content: prepareContent("color: red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 13,
              endIndex: 24,
              getRaw(): string { return "color: red;"; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<div style= \"color: red;\"><div>",
          },
          expected: [
            {
              content: prepareContent("color: red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 13,
              endIndex: 24,
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
            content: "<div disabled  style=\"color: blue;\"><div>",
          },
          expected: [
            {
              content: prepareContent("color: blue;"),
              type: EMBED_TYPE_CSS,
              startIndex: 22,
              endIndex: 34,
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
            content: "<div id=\"foobar\"  style=\"color: red;\"><div>",
          },
          expected: [
            {
              content: prepareContent("color: red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 25,
              endIndex: 36,
              getRaw(): string { return "color: red;"; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<div id= \"foobar\" style=\"color: red;\"><div>",
          },
          expected: [
            {
              content: prepareContent("color: red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 25,
              endIndex: 36,
              getRaw(): string { return "color: red;"; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<div id =\"foobar\" style=\"color: red;\"><div>",
          },
          expected: [
            {
              content: prepareContent("color: red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 25,
              endIndex: 36,
              getRaw(): string { return "color: red;"; },
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
      testName: "no quotes",
      getScenario: () => [
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
        {
          file: {
            type: "html",
            content: "<div style =color:red;><div>",
          },
          expected: [
            {
              content: prepareContent("color:red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 12,
              endIndex: 22,
              getRaw(): string { return "color:red;"; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<div style= color:red;><div>",
          },
          expected: [
            {
              content: prepareContent("color:red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 12,
              endIndex: 22,
              getRaw(): string { return "color:red;"; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<div  style=color:red;><div>",
          },
          expected: [
            {
              content: prepareContent("color:red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 12,
              endIndex: 22,
              getRaw(): string { return "color:red;"; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<div id=\"foobar\" style=color:red;><div>",
          },
          expected: [
            {
              content: prepareContent("color:red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 23,
              endIndex: 33,
              getRaw(): string { return "color:red;"; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<div id=\"foobar\"  style=color:red;><div>",
          },
          expected: [
            {
              content: prepareContent("color:red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 24,
              endIndex: 34,
              getRaw(): string { return "color:red;"; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<div id =\"foobar\" style=color:red;><div>",
          },
          expected: [
            {
              content: prepareContent("color:red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 24,
              endIndex: 34,
              getRaw(): string { return "color:red;"; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<div id= \"foobar\" style=color:red;><div>",
          },
          expected: [
            {
              content: prepareContent("color:red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 24,
              endIndex: 34,
              getRaw(): string { return "color:red;"; },
            },
          ],
        },
      ],
    },
    {
      testName: "comments",
      getScenario: () => [
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
            content: "<!-- \n <div style=\"color: red;\"><div>-->",
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
      testName: "attribute casing",
      getScenario: () => [
        {
          file: {
            type: "html",
            content: "<div STYLE=\"color:red;\">foobar</div>",
          },
          expected: [
            {
              content: prepareContent("color:red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 12,
              endIndex: 22,
              getRaw(): string {
                return "color:red;";
              },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<div Style=\"color:red;\">foobar</div>",
          },
          expected: [
            {
              content: prepareContent("color:red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 12,
              endIndex: 22,
              getRaw(): string {
                return "color:red;";
              },
            },
          ],
        },
      ],
    },
    {
      testName: "edge cases, with matches",
      getScenario: () => [
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
            content: "< div style=\"color: red;\"><div>",
          },
          expected: [
            {
              content: prepareContent("color: red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 13,
              endIndex: 24,
              getRaw(): string { return "color: red;"; },
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
        {
          file: {
            type: "html",
            content: "<!--foo--!><div style=\"color: red;\"><div><!--bar-->",
          },
          expected: [
            {
              content: prepareContent("color: red;"),
              type: EMBED_TYPE_CSS,
              startIndex: 23,
              endIndex: 34,
              getRaw(): string { return "color: red;"; },
            },
          ],
        },
      ],
    },
    {
      testName: "edge cases, without matches",
      getScenario: () => [
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
            content: "<divstyle=color:red;><div>",
          },
          expected: [],
        },
        {
          file: {
            type: "html",
            content: "<!--<div style=\"color: red;\"><div>--!>",
          },
          expected: [],
        },
      ],
    },
  ];

  for (const { getScenario, testName } of scenarios) {
    test(testName, function() {
      for (const testCase of getScenario()) {
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
