import type { TestScenarios } from "@webmangler/testing";
import type {
  WebManglerFile,
} from "@webmangler/types";

import type { IdentifiableWebManglerEmbed } from "../../types";

import { expect } from "chai";

import { reEmbed } from "../../insert";

suite("Embeds", function() {
  const idPrefix = "wm-embed@";

  suite("::reEmbed", function() {
    interface TestCase {
      readonly embeds: IdentifiableWebManglerEmbed[];
      readonly file: WebManglerFile;
      readonly expected: string;
    }

    const scenarios: TestScenarios<Iterable<TestCase>> = [
      {
        testName: "sample",
        getScenario: () => [
          {
            embeds: [
              {
                content: "var foo = \"bar\";",
                type: "js",
                startIndex: 3,
                endIndex: 14,
                getRaw(): string { return this.content; },
                id: "1234567890-1",
              },
            ],
            file: {
              type: "html",
              content: `<script>${idPrefix}1234567890-1</script>`,
            },
            expected: "<script>var foo = \"bar\";</script>",
          },
          {
            embeds: [
              {
                content: ":root{color: red;}",
                type: "js",
                startIndex: 3,
                endIndex: 14,
                getRaw(): string { return "color: red;"; },
                id: "0987654321-2",
              },
            ],
            file: {
              type: "html",
              content: `<div style="${idPrefix}0987654321-2"></div>`,
            },
            expected: "<div style=\"color: red;\"></div>",
          },
          {
            embeds: [
              {
                content: ".foo { font: serif; }",
                type: "css",
                startIndex: 3,
                endIndex: 14,
                getRaw(): string { return this.content; },
                id: "12345-1",
              },
              {
                content: "var foo = \"bar\";",
                type: "js",
                startIndex: 2,
                endIndex: 72,
                getRaw(): string { return this.content; },
                id: "12345-2",
              },
            ],
            file: {
              type: "html",
              content: `<style>${idPrefix}12345-1</style>` +
                `<script>${idPrefix}12345-2</script>`,
            },
            expected: "<style>.foo { font: serif; }</style>" +
              "<script>var foo = \"bar\";</script>",
          },
        ],
      },
      {
        testName: "edge cases",
        getScenario: () => [
          {
            embeds: [],
            file: {
              type: "html",
              content: "<div>foobar</div>",
            },
            expected: "<div>foobar</div>",
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const { embeds, expected, file } = testCase;

          reEmbed(embeds, file);
          expect(file.content).to.equal(expected);
        }
      });
    }

    test("id prefix appears in the file content", function() {
      const file = {
        type: "html",
        content: `<div>${idPrefix}</div>`,
      };

      expect(() => {
        reEmbed([], file);
      }).not.to.throw();
    });
  });
});
