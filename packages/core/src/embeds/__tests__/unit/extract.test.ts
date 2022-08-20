import type { TestScenarios } from "@webmangler/testing";
import type {
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

import type { IdentifiableWebManglerEmbed } from "../../types";

import { WebManglerLanguagePluginMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import { extractEmbedsFromContent } from "../../extract";

suite("Embeds", function() {
  const idPrefix = "wm-embed@";

  suite("::extractEmbedsFromContent", function() {
    const idPattern = `${idPrefix}[a-zA-Z0-9]+-[0-9]+`;

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
});
