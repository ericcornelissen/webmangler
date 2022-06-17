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
              content: " .foobar{color:red;} ",
              type: EMBED_TYPE_CSS,
              startIndex: 15,
              endIndex: 36,
              getRaw(): string { return " .foobar{color:red;} "; },
            },
          ],
        },
        {
          file: {
            type: "css",
            content: "@media screen and (max-width: 600px) {#id{color:blue;}}",
          },
          expected: [
            {
              content: "#id{color:blue;}",
              type: EMBED_TYPE_CSS,
              startIndex: 38,
              endIndex: 54,
              getRaw(): string { return "#id{color:blue;}"; },
            },
          ],
        },
        {
          file: {
            type: "css",
            content: ".foo{color:red;}" +
              "@media print {#id{font:monospace;}}" +
              ".bar{color:orange;}" +
              "@media screen {.foo{color:blue;}}",
          },
          expected: [
            {
              content: "#id{font:monospace;}",
              type: EMBED_TYPE_CSS,
              startIndex: 30,
              endIndex: 50,
              getRaw(): string { return "#id{font:monospace;}"; },
            },
            {
              content: ".foo{color:blue;}",
              type: EMBED_TYPE_CSS,
              startIndex: 85,
              endIndex: 102,
              getRaw(): string { return ".foo{color:blue;}"; },
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
            type: "css",
            content: "/*@media screen { .foobar{color:red;} }*/",
          },
          expected: [],
        },
        {
          file: {
            type: "css",
            content: "/* \n @media screen { .foobar{color:blue;} }*/",
          },
          expected: [],
        },
        {
          file: {
            type: "css",
            content: "/* \n @media screen { .foobar{color:red;} }*/" +
              "@media screen { .foobar{color:blue;} }",
          },
          expected: [
            {
              content: " .foobar{color:blue;} ",
              type: EMBED_TYPE_CSS,
              startIndex: 59,
              endIndex: 81,
              getRaw(): string { return " .foobar{color:blue;} "; },
            },
          ],
        },
        {
          file: {
            type: "css",
            content: "@media screen { .foobar{color:red;} }" +
              "/* @media screen { .foobar{color:blue;} } */",
          },
          expected: [
            {
              content: " .foobar{color:red;} ",
              type: EMBED_TYPE_CSS,
              startIndex: 15,
              endIndex: 36,
              getRaw(): string { return " .foobar{color:red;} "; },
            },
          ],
        },
        {
          file: {
            type: "css",
            content: "/* foo */@media screen { .foobar{color:red;} }/* bar */",
          },
          expected: [
            {
              content: " .foobar{color:red;} ",
              type: EMBED_TYPE_CSS,
              startIndex: 24,
              endIndex: 45,
              getRaw(): string { return " .foobar{color:red;} "; },
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
            type: "css",
            content: "@media screen { }",
          },
          expected: [
            {
              content: " ",
              type: EMBED_TYPE_CSS,
              startIndex: 15,
              endIndex: 16,
              getRaw(): string { return " "; },
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
            type: "css",
            content: ".foobar{color:purple;}",
          },
          expected: [],
        },
        {
          file: {
            type: "css",
            content: "@media screen {}",
          },
          expected: [],
        },
        {
          file: {
            type: "css",
            content: "@mediascreen { .foobar{color:purple;} }",
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
