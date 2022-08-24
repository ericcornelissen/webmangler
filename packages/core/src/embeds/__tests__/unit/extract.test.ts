import type { TestScenarios } from "@webmangler/testing";
import type {
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

import type { IdentifiableWebManglerEmbed } from "../../types";

import { WebManglerLanguagePluginMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import {
  buildExtractEmbedsFromContent,
  compareStartIndex,
  generateUniqueString,
} from "../../extract";

suite("Embeds", function() {
  suite("::compareStartIndex", function() {
    interface TestCase {
      readonly a: number;
      readonly b: number;
    }

    test("a before b", function() {
      const testCases: ReadonlyArray<TestCase> = [
        { a: 1, b: 2 },
        { a: 1, b: 3 },
        { a: 2, b: 3 },
        { a: -1, b: 42 },
        { a: -2, b: -1 },
      ];

      for (const testCase of testCases) {
        const a = {
          startIndex: testCase.a,
        };
        const b = {
          startIndex: testCase.b,
        };

        const result = compareStartIndex(a, b);
        expect(result).to.be.below(0);
      }
    });

    test("b before a", function() {
      const testCases: ReadonlyArray<TestCase> = [
        { a: 2, b: 1 },
        { a: 3, b: 1 },
        { a: 3, b: 2 },
        { a: 42, b: -1 },
        { a: -1, b: -2 },
      ];

      for (const testCase of testCases) {
        const a = {
          startIndex: testCase.a,
        };
        const b = {
          startIndex: testCase.b,
        };

        const result = compareStartIndex(a, b);
        expect(result).to.be.above(0);
      }
    });

    test("a equal to b", function() {
      const testCases: ReadonlyArray<number> = [
        0,
        1,
        -1,
        42,
      ];

      for (const testCase of testCases) {
        const a = {
          startIndex: testCase,
        };
        const b = a;

        const result = compareStartIndex(a, b);
        expect(result).to.equal(0);
      }
    });
  });

  suite("::extractEmbedsFromContent", function() {
    // TODO: This is currently an integration test suite because it integrates
    // compareStartIndex and generateUniqueString into extractEmbedsFromContent.

    const idPrefix = "wm-embed@";
    const idPattern = `${idPrefix}[a-zA-Z0-9]+-[0-9]+`;

    const extractEmbedsFromContent = buildExtractEmbedsFromContent({
      compareStartIndex,
      generateUniqueString,
      idPrefix,
    });

    interface TestCase {
      readonly input: {
        readonly file: WebManglerFile;
        readonly plugin: WebManglerLanguagePlugin;
      };
      readonly expected: {
        readonly embeds: ReadonlyArray<IdentifiableWebManglerEmbed>;
        readonly file: WebManglerFile;
      };
    }

    const scenarios: TestScenarios<TestCase> = [
      {
        testName: "example 1",
        getScenario: () => {
          const cssEmbed = ".foo { color: red; }";
          const stylesheet = `<style>${cssEmbed}</style>`;

          return {
            input: {
              file: {
                type: "html",
                content: stylesheet,
              },
              plugin: new WebManglerLanguagePluginMock({
                getEmbeds: sinon.stub().returns([
                  {
                    content: cssEmbed,
                    type: "css",
                    startIndex: 7,
                    endIndex: 27,
                    getRaw(): string { return this.content; },
                  },
                ]),
              }),
            },
            expected: {
              embeds: [
                {
                  content: ".foo { color: red; }",
                  type: "css",
                  startIndex: 7,
                  endIndex: 27,
                  getRaw(): string { return this.content; },
                  id: "a-7",
                },
              ],
              file: {
                type: "html",
                content: `<style>${idPattern}</style>`,
              },
            },
          };
        },
      },
      {
        testName: "example 2",
        getScenario: () => {
          const jsEmbed = "var x = document.getElementById(\"bar\");";
          const script = `<script>${jsEmbed}</script>`;

          return {
            input: {
              file: {
                type: "html",
                content: script,
              },
              plugin: new WebManglerLanguagePluginMock({
                getEmbeds: sinon.stub().returns([
                  {
                    content: jsEmbed,
                    type: "js",
                    startIndex: 8,
                    endIndex: 47,
                    getRaw(): string { return this.content; },
                  },
                ]),
              }),
            },
            expected: {
              embeds: [
                {
                  content: "var x = document.getElementById\\(\"bar\"\\);",
                  type: "js",
                  startIndex: 8,
                  endIndex: 47,
                  getRaw(): string { return this.content; },
                  id: "f-8",
                },
              ],
              file: {
                type: "html",
                content: `<script>${idPattern}</script>`,
              },
            },
          };
        },
      },
      {
        testName: "example 3",
        getScenario: () => {
          const cssEmbed = ".foo { color: red; }";
          const jsEmbed = "var x = document.getElementById(\"bar\");";

          const stylesheet = `<style>${cssEmbed}</style>`;
          const script = `<script>${jsEmbed}</script>`;

          return {
            input: {
              file: {
                type: "html",
                content: `${stylesheet}${script}`,
              },
              plugin: new WebManglerLanguagePluginMock({
                getEmbeds: sinon.stub().returns([
                  {
                    content: ".foo { color: red; }",
                    type: "css",
                    startIndex: 7,
                    endIndex: 27,
                    getRaw(): string { return this.content; },
                  },
                  {
                    content: "var x = document.getElementById(\"bar\");",
                    type: "js",
                    startIndex: 43,
                    endIndex: 82,
                    getRaw(): string { return this.content; },
                  },
                ]),
              }),
            },
            expected: {
              embeds: [
                {
                  content: ".foo { color: red; }",
                  type: "css",
                  startIndex: 7,
                  endIndex: 27,
                  getRaw(): string { return this.content; },
                  id: "h-7",
                },
                {
                  content: "var x = document.getElementById\\(\"bar\"\\);",
                  type: "js",
                  startIndex: 43,
                  endIndex: 82,
                  getRaw(): string { return this.content; },
                  id: "h-43",
                },
              ],
              file: {
                type: "html",
                content: `<style>${idPattern}</style>` +
                  `<script>${idPattern}</script>`,
              },
            },
          };
        },
      },
      {
        testName: "example 4",
        getScenario: () => {
          const cssEmbed = ".foo { color: red; }";
          const jsEmbed = "var x = document.getElementById(\"bar\");";

          const stylesheet = `<style>${cssEmbed}</style>`;
          const script = `<script>${jsEmbed}</script>`;

          return {
            input: {
              file: {
                type: "html",
                content: `${stylesheet}${script}`,
              },
              plugin: new WebManglerLanguagePluginMock({
                getEmbeds: sinon.stub().returns([
                  {
                    content: jsEmbed,
                    type: "js",
                    startIndex: 43,
                    endIndex: 82,
                    getRaw(): string { return this.content; },
                  },
                  {
                    content: cssEmbed,
                    type: "css",
                    startIndex: 7,
                    endIndex: 27,
                    getRaw(): string { return this.content; },
                  },
                ]),
              }),
            },
            expected: {
              embeds: [
                {
                  content: ".foo { color: red; }",
                  type: "css",
                  startIndex: 7,
                  endIndex: 27,
                  getRaw(): string { return this.content; },
                  id: "h-7",
                },
                {
                  content: "var x = document.getElementById\\(\"bar\"\\);",
                  type: "js",
                  startIndex: 43,
                  endIndex: 82,
                  getRaw(): string { return this.content; },
                  id: "h-43",
                },
              ],
              file: {
                type: "html",
                content: `<style>${idPattern}</style>` +
                  `<script>${idPattern}</script>`,
              },
            },
          };
        },
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        const testCase = getScenario();
        const { expected, input: { file, plugin } } = testCase;

        const embeds = extractEmbedsFromContent(file, plugin);

        expect(plugin.getEmbeds).to.have.been.calledWith(file);

        expect(embeds).to.have.length(expected.embeds.length);
        for (const i in Array.from(embeds)) {
          const embed = Array.from(embeds)[i];
          const expectedEmbed = expected.embeds[i];
          const expectedContent = new RegExp(`^${expectedEmbed.content}$`);
          expect(embed.content).to.match(expectedContent);
          expect(embed.type).to.equal(expectedEmbed.type);
          expect(embed.startIndex).to.equal(expectedEmbed.startIndex);
          expect(embed.endIndex).to.equal(expectedEmbed.endIndex);
          expect(embed.getRaw()).to.match(expectedContent);
          expect(embed.id).to.equal(expectedEmbed.id);
        }

        {
          const expectedFile = expected.file;
          const expectedContent = new RegExp(`^${expectedFile.content}$`);
          expect(file.content).to.match(expectedContent);
          expect(file.type).to.equal(expectedFile.type);
        }
      });
    }
  });

  suite("::generateUniqueString", function() {
    interface TestCase {
      readonly testString: string;
      readonly expected: string;
    }

    test("generate strings", function() {
      const testCases: ReadonlyArray<TestCase> = [
        {
          testString: "foobar",
          expected: "c",
        },
        {
          testString: "Hello world!",
          expected: "a",
        },
        {
          testString: "Lorem ipsum dolor",
          expected: "a",
        },
        {
          testString: ".cls { color: orange; }",
          expected: "b",
        },
        {
          testString: "<p id='foo' class='bar'>Hello world!</p>",
          expected: "g",
        },
        {
          testString: "var foo = document.getElementById('.bar');",
          expected: "h",
        },
      ];

      for (const { expected, testString } of testCases) {
        const result = generateUniqueString(testString);
        expect(result).to.equal(
          expected,
          `incorrect result for \`${testString}\``,
        );
      }
    });
  });
});
