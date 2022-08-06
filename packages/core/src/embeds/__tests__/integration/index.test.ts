import type { TestScenarios } from "@webmangler/testing";
import type {
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

import { WebManglerLanguagePluginMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import { getEmbeds, reEmbed } from "../../index";

suite("Embeds", function() {
  interface TestCase {
    readonly files: WebManglerFile[];
    readonly plugins: WebManglerLanguagePlugin[];
    readonly expected: WebManglerFile[];
  }

  const scenarios: TestScenarios<Iterable<TestCase>> = [
    {
      testName: "sample",
      getScenario: () => {
        const cssEmbed = ".foo { color: red; }";
        const mangledCssEmbed = ".a { color: red; }";
        const jsEmbed = "var x = document.getElementById(\"bar\");";
        const mangledJsEmbed = "var x = document.getElementById(\"a\");";

        const stylesheet = `<style>${cssEmbed}</style>`;
        const mangledStylesheet = `<style>${mangledCssEmbed}</style>`;
        const script = `<script>${jsEmbed}</script>`;
        const mangledScript = `<script>${mangledJsEmbed}</script>`;

        const fileContent = `<html>${stylesheet}${script}</html>`;

        return [
          {
            files: [
              {
                type: "html",
                content: fileContent,
              },
            ],
            plugins: [
              new WebManglerLanguagePluginMock({
                getEmbeds: sinon.stub().callsFake(({ content }) => {
                  switch (content) {
                  case fileContent:
                    return [
                      {
                        content: cssEmbed,
                        type: "css",
                        startIndex: 13,
                        endIndex: 33,
                        getRaw(): string {
                          return mangledCssEmbed;
                        },
                      },
                      {
                        content: jsEmbed,
                        type: "js",
                        startIndex: 49,
                        endIndex: 88,
                        getRaw(): string {
                          return mangledJsEmbed;
                        },
                      },
                    ];
                  default:
                    return [];
                  }
                }),
              }),
            ],
            expected: [
              {
                type: "html",
                content: `<html>${mangledStylesheet}${mangledScript}</html>`,
              },
            ],
          },
        ];
      },
    },
    {
      testName: "nested embeds",
      getScenario: () => {
        const mediaEmbed = ".bar { color: blue; }";
        const mangledMediaEmbed = ".b { color: blue; }";
        const cssEmbed = `.foo { color: red; } @media screen {${mediaEmbed}}`;
        const mangledCssEmbed =
          `.a { color: red; } @media screen {${mangledMediaEmbed}}`;

        const stylesheet = `<style>${cssEmbed}</style>`;
        const mangledStylesheet = `<style>${mangledCssEmbed}</style>`;

        const fileContent = `<html>${stylesheet}</html>`;

        return [
          {
            files: [
              {
                type: "html",
                content: fileContent,
              },
            ],
            plugins: [
              new WebManglerLanguagePluginMock({
                getEmbeds: sinon.stub().callsFake(({ content }) => {
                  switch (content) {
                  case fileContent:
                    return [
                      {
                        content: cssEmbed,
                        type: "css",
                        startIndex: 13,
                        endIndex: 71,
                        getRaw(): string {
                          return this.content.replace(".foo", ".a");
                        },
                      },
                    ];
                  case cssEmbed:
                    return [
                      {
                        content: mediaEmbed,
                        type: "css",
                        startIndex: 36,
                        endIndex: 57,
                        getRaw(): string {
                          return this.content.replace(".bar", ".b");
                        },
                      },
                    ];
                  default:
                    return [];
                  }
                }),
              }),
            ],
            expected: [
              {
                type: "html",
                content: `<html>${mangledStylesheet}</html>`,
              },
            ],
          },
        ];
      },
    },
  ];

  for (const { getScenario, testName } of scenarios) {
    test(testName, function() {
      for (const testCase of getScenario()) {
        const { expected, files, plugins } = testCase;

        const embedsMap = getEmbeds(files, plugins);
        embedsMap.forEach(reEmbed);
        expect(files).to.deep.equal(expected);
      }
    });
  }
});
