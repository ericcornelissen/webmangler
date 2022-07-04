import type { TestScenarios } from "@webmangler/testing";
import type {
  WebManglerEmbed,
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

import type { IdentifiableWebManglerEmbed } from "../../embeds";

import { WebManglerLanguagePluginMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import { getEmbeds, reEmbed } from "../../embeds";

suite("Embeds", function() {
  const idPrefix = "wm-embed@";

  suite("::getEmbeds", function() {
    const idPattern = `${idPrefix}[a-zA-Z0-9]+-[0-9]+`;

    interface TestCase {
      readonly files: WebManglerFile[];
      readonly plugins: WebManglerLanguagePlugin[];
      readonly expected: {
        readonly embeds: WebManglerEmbed[];
        readonly files: WebManglerFile[];
      };
    }

    const scenarios: TestScenarios<Iterable<TestCase>> = [
      {
        testName: "sample",
        getScenario: () => [
          {
            files: [
              {
                type: "html",
                content: "<style>.foobar { color: red; }</style>",
              },
            ],
            plugins: [
              new WebManglerLanguagePluginMock({
                getEmbeds: sinon.stub().returns([
                  {
                    content: ".foobar { color: red; }",
                    type: "css",
                    startIndex: 7,
                    endIndex: 30,
                    getRaw(): string { return this.content; },
                  },
                ]),
              }),
            ],
            expected: {
              embeds: [
                {
                  content: ".foobar { color: red; }",
                  type: "css",
                  startIndex: 7,
                  endIndex: 30,
                  getRaw(): string { return this.content; },
                },
              ],
              files: [
                {
                  type: "html",
                  content: `<style>${idPattern}</style>`,
                },
              ],
            },
          },
          {
            files: [
              {
                type: "html",
                content: "<script>var x = document.getElementById(\"foobar\");</script>",
              },
            ],
            plugins: [
              new WebManglerLanguagePluginMock({
                getEmbeds: sinon.stub().returns([
                  {
                    content: "var x = document.getElementById(\"foobar\");",
                    type: "js",
                    startIndex: 8,
                    endIndex: 50,
                    getRaw(): string { return this.content; },
                  },
                ]),
              }),
            ],
            expected: {
              embeds: [
                {
                  content: "var x = document.getElementById(\"foobar\");",
                  type: "js",
                  startIndex: 8,
                  endIndex: 50,
                  getRaw(): string { return this.content; },
                },
              ],
              files: [
                {
                  type: "html",
                  content: `<script>${idPattern}</script>`,
                },
              ],
            },
          },
          {
            files: [
              {
                type: "html",
                content: "<style>.foo { color: blue; }</style>" +
                  "<script>var x = document.getElementById(\"bar\");</script>",
              },
            ],
            plugins: [
              new WebManglerLanguagePluginMock({
                getEmbeds: sinon.stub().returns([
                  {
                    content: "var x = document.getElementById(\"bar\");",
                    type: "js",
                    startIndex: 44,
                    endIndex: 83,
                    getRaw(): string { return this.content; },
                  },
                  {
                    content: ".foo { color: blue; }",
                    type: "css",
                    startIndex: 7,
                    endIndex: 28,
                    getRaw(): string { return this.content; },
                  },
                ]),
              }),
            ],
            expected: {
              embeds: [
                {
                  content: ".foo { color: blue; }",
                  type: "css",
                  startIndex: 7,
                  endIndex: 28,
                  getRaw(): string { return this.content; },
                },
                {
                  content: "var x = document.getElementById(\"bar\");",
                  type: "js",
                  startIndex: 44,
                  endIndex: 83,
                  getRaw(): string { return this.content; },
                },
              ],
              files: [
                {
                  type: "html",
                  content: `<style>${idPattern}</style>` +
                    `<script>${idPattern}</script>`,
                },
              ],
            },
          },
        ],
      },
      {
        testName: "edge cases",
        getScenario: () => [
          {
            files: [],
            plugins: [
              new WebManglerLanguagePluginMock(),
            ],
            expected: {
              embeds: [],
              files: [],
            },
          },
          {
            files: [
              { type: "type", content: "content" },
            ],
            plugins: [],
            expected: {
              embeds: [],
              files: [
                { type: "type", content: "content" },
              ],
            },
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const { expected, files, plugins } = testCase;

          const embedsMap = getEmbeds(files, plugins);

          const embeds: IdentifiableWebManglerEmbed[] = [];
          for (const fileEmbeds of embedsMap.values()) {
            embeds.push(...fileEmbeds);
          }

          for (const file of files) {
            for (const plugin of plugins) {
              expect(plugin.getEmbeds).to.have.been.calledOnceWith(file);
            }
          }

          expect(embeds).to.have.length(expected.embeds.length);
          for (const i in embeds) {
            const embed = embeds[i];
            const expectedEmbed = expected.embeds[i];
            expect(embed.content).to.equal(expectedEmbed.content);
            expect(embed.type).to.equal(expectedEmbed.type);
            expect(embed.startIndex).to.equal(expectedEmbed.startIndex);
            expect(embed.endIndex).to.equal(expectedEmbed.endIndex);
            expect(embed.getRaw()).to.equal(expectedEmbed.getRaw());
            expect(embed.id).to.be.a.string;
          }

          expect(expected.files.length).to.equal(files.length);
          for (const i in files) {
            const file = files[i];
            const expectedFile = expected.files[i];
            const expectedContent = new RegExp(`^${expectedFile.content}$`);
            expect(file.content).to.match(expectedContent);
            expect(file.type).to.equal(expectedFile.type);
          }
        }
      });
    }
  });

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
