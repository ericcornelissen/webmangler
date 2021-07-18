import type { TestScenario } from "@webmangler/testing";

import type { TestCase } from "../../__tests__/types";

import { expect } from "chai";

import { getScriptTagsAsEmbeds } from "../script-tag";

const EMBED_TYPE_JS = "js";

suite("HTML JavaScript Embeds - <script> tag", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          file: {
            type: "html",
            content: "<script>var foo = \"bar\";</script>",
          },
          expected: [
            {
              content: "var foo = \"bar\";",
              type: EMBED_TYPE_JS,
              startIndex: 8,
              endIndex: 24,
              getRaw(): string { return this.content; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<html>" +
              "<head>" +
              "<script>var foo = \"bar\";</script>" +
              "<script>var hello = \"world\";</script>" +
              "</head>" +
              "</html>",
          },
          expected: [
            {
              content: "var foo = \"bar\";",
              type: EMBED_TYPE_JS,
              startIndex: 20,
              endIndex: 36,
              getRaw(): string { return this.content; },
            },
            {
              content: "var hello = \"world\";",
              type: EMBED_TYPE_JS,
              startIndex: 53,
              endIndex: 73,
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
            content: "<!--<script>var foo = \"bar\";</script>-->",
          },
          expected: [],
        },
        {
          file: {
            type: "html",
            content: "<!--<script>var foo = \"bar\";</script>-->" +
              "<script>var foo = \"baz\";</script>",
          },
          expected: [
            {
              content: "var foo = \"baz\";",
              type: EMBED_TYPE_JS,
              startIndex: 48,
              endIndex: 64,
              getRaw(): string { return this.content; },
            },
          ],
        },
        {
          file: {
            type: "html",
            content: "<script>var foo = \"bar\";</script>" +
             "<!--<script>var foo = \"baz\";</script>-->",
          },
          expected: [
            {
              content: "var foo = \"bar\";",
              type: EMBED_TYPE_JS,
              startIndex: 8,
              endIndex: 24,
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
            content: "<script></script>",
          },
          expected: [],
        },
        {
          file: {
            type: "html",
            content: "<script> </script>",
          },
          expected: [
            {
              content: " ",
              type: EMBED_TYPE_JS,
              startIndex: 8,
              endIndex: 9,
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

        const embeds = getScriptTagsAsEmbeds(file);
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
