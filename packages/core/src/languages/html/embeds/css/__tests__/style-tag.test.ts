import type { TestScenario } from "@webmangler/testing";

import type { TestCase } from "../../__tests__/types";

import { expect } from "chai";

import { getStyleTagsAsEmbeds } from "../style-tag";

const EMBED_TYPE_CSS = "css";

suite("HTML CSS Embeds - <style> tag", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          file: {
            type: "html",
            content: "<style>.foobar { color: red; }</style>",
          },
          expected: [
            {
              content: ".foobar { color: red; }",
              type: EMBED_TYPE_CSS,
              startIndex: 7,
              endIndex: 30,
              getRaw(): string { return this.content; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<html>" +
              "<head>" +
              "<style>.foo { color: red; }</style>" +
              "<style>.bar { font: serif; }</style>" +
              "</head>" +
              "</html>",
          },
          expected: [
            {
              content: ".foo { color: red; }",
              type: EMBED_TYPE_CSS,
              startIndex: 19,
              endIndex: 39,
              getRaw(): string { return this.content; },
            },
            {
              content: ".bar { font: serif; }",
              type: EMBED_TYPE_CSS,
              startIndex: 54,
              endIndex: 75,
              getRaw(): string { return this.content; },
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
            content: "<!--<style>.foobar { color: red; }</style>-->",
          },
          expected: [],
        },
        {
          file: {
            type: "html",
            content: "<!--<style>.foobar { color: red; }</style>-->" +
              "<style>.foobar { color: blue; }</style>",
          },
          expected: [
            {
              content: ".foobar { color: blue; }",
              type: EMBED_TYPE_CSS,
              startIndex: 52,
              endIndex: 76,
              getRaw(): string { return this.content; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<style>.foobar { color: red; }</style>" +
             "<!--<style>.foobar { color: blue; }</style>-->",
          },
          expected: [
            {
              content: ".foobar { color: red; }",
              type: EMBED_TYPE_CSS,
              startIndex: 7,
              endIndex: 30,
              getRaw(): string { return this.content; },
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
            content: "<style></style>",
          },
          expected: [],
        },
        {
          file: {
            type: "html",
            content: "<style> </style>",
          },
          expected: [
            {
              content: " ",
              type: EMBED_TYPE_CSS,
              startIndex: 7,
              endIndex: 8,
              getRaw(): string { return this.content; },
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

        const embeds = getStyleTagsAsEmbeds(file);
        expect(embeds).to.have.length(expected.length, file.content);

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
