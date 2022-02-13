import type { TestScenarios } from "@webmangler/testing";

import type { TestCase } from "../common";

import { expect } from "chai";

import { getStyleTagsAsEmbeds } from "../../style-tag";

const EMBED_TYPE_CSS = "css";

suite("HTML CSS Embeds - <style> tag", function() {
  const scenarios: TestScenarios<TestCase[]> = [
    {
      testName: "sample",
      getScenario: () => [
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
            content: "<style type=\"text/css\">.foobar { color: red; }</style>",
          },
          expected: [
            {
              content: ".foobar { color: red; }",
              type: EMBED_TYPE_CSS,
              startIndex: 23,
              endIndex: 46,
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
      testName: "comments",
      getScenario: () => [
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
            content: "<!-- \n <style>.foobar { color: red; }</style>-->",
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
      testName: "tag casing",
      getScenario: () => [
        {
          file: {
            type: "html",
            content: "<STYLE>.foobar { color: red; }</STYLE>",
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
            content: "<Style>.foobar { color: red; }</Style>",
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
      testName: "edge cases, with matches",
      getScenario: () => [
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
        {
          file: {
            type: "html",
            content: "< style>.foobar { color: red; }</style>",
          },
          expected: [
            {
              content: ".foobar { color: red; }",
              type: EMBED_TYPE_CSS,
              startIndex: 8,
              endIndex: 31,
              getRaw(): string { return this.content; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<style>.foobar { color: red; }</style hello=\"world\">",
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
            content: "<!--foo--!><style>.foobar { color: red; }</style><!--bar-->",
          },
          expected: [
            {
              content: ".foobar { color: red; }",
              type: EMBED_TYPE_CSS,
              startIndex: 18,
              endIndex: 41,
              getRaw(): string { return this.content; },
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
            content: "<style></style>",
          },
          expected: [],
        },
        {
          file: {
            type: "html",
            content: "<!--<style>.foobar { color: red; }</style>--!>",
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

        const embeds = getStyleTagsAsEmbeds(file);
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
