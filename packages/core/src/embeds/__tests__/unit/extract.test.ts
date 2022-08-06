import type { TestScenarios } from "@webmangler/testing";
import type {
  WebManglerEmbed,
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

import type { IdentifiableWebManglerEmbed } from "../../types";

import { WebManglerLanguagePluginMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import { getEmbeds } from "../../extract";

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
        getScenario: () => {
          const cssEmbed = ".foo { color: red; }";
          const jsEmbed = "var x = document.getElementById(\"bar\");";

          const stylesheet = `<style>${cssEmbed}</style>`;
          const script = `<script>${jsEmbed}</script>`;

          return [
            {
              files: [
                {
                  type: "html",
                  content: stylesheet,
                },
              ],
              plugins: [
                new WebManglerLanguagePluginMock({
                  getEmbeds: sinon.stub().callsFake(({ content }) => {
                    if (content === stylesheet) {
                      return [
                        {
                          content: cssEmbed,
                          type: "css",
                          startIndex: 7,
                          endIndex: 27,
                          getRaw(): string { return this.content; },
                        },
                      ];
                    }

                    return [];
                  }),
                }),
              ],
              expected: {
                embeds: [
                  {
                    content: ".foo { color: red; }",
                    type: "css",
                    startIndex: 7,
                    endIndex: 27,
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
                  content: script,
                },
              ],
              plugins: [
                new WebManglerLanguagePluginMock({
                  getEmbeds: sinon.stub().callsFake(({ content }) => {
                    if (content === script) {
                      return [
                        {
                          content: jsEmbed,
                          type: "js",
                          startIndex: 8,
                          endIndex: 47,
                          getRaw(): string { return this.content; },
                        },
                      ];
                    }

                    return [];
                  }),
                }),
              ],
              expected: {
                embeds: [
                  {
                    content: "var x = document.getElementById\\(\"bar\"\\);",
                    type: "js",
                    startIndex: 8,
                    endIndex: 47,
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
                  content: `${stylesheet}${script}`,
                },
              ],
              plugins: [
                new WebManglerLanguagePluginMock({
                  getEmbeds: sinon.stub().callsFake(({ content }) => {
                    if (content === `${stylesheet}${script}`) {
                      return [
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
                      ];
                    }

                    return [];
                  }),
                }),
              ],
              expected: {
                embeds: [
                  {
                    content: ".foo { color: red; }",
                    type: "css",
                    startIndex: 7,
                    endIndex: 27,
                    getRaw(): string { return this.content; },
                  },
                  {
                    content: "var x = document.getElementById\\(\"bar\"\\);",
                    type: "js",
                    startIndex: 43,
                    endIndex: 82,
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
            {
              files: [
                {
                  type: "html",
                  content: `${stylesheet}${script}`,
                },
              ],
              plugins: [
                new WebManglerLanguagePluginMock({
                  getEmbeds: sinon.stub().callsFake(({ content }) => {
                    if (content.includes(stylesheet)) {
                      return [
                        {
                          content: ".foo { color: red; }",
                          type: "css",
                          startIndex: 7,
                          endIndex: 27,
                          getRaw(): string { return this.content; },
                        },
                      ];
                    }

                    return [];
                  }),
                }),
                new WebManglerLanguagePluginMock({
                  getEmbeds: sinon.stub().callsFake(({ content }) => {
                    if (content.includes(script)) {
                      return [
                        {
                          content: "var x = document.getElementById(\"bar\");",
                          type: "js",
                          startIndex: 35,
                          endIndex: 74,
                          getRaw(): string { return this.content; },
                        },
                      ];
                    }

                    return [];
                  }),
                }),
              ],
              expected: {
                embeds: [
                  {
                    content: ".foo { color: red; }",
                    type: "css",
                    startIndex: 7,
                    endIndex: 27,
                    getRaw(): string { return this.content; },
                  },
                  {
                    content: "var x = document.getElementById\\(\"bar\"\\);",
                    type: "js",
                    startIndex: 35,
                    endIndex: 74,
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
          ];
        },
      },
      {
        testName: "nested embeds",
        getScenario: () => {
          const cssEmbed = ".foo { color: blue; }";
          const mediaEmbed = `@media screen {${cssEmbed}}`;
          const fileContent = `<style>${mediaEmbed}</style>`;

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
                    if (content === fileContent) {
                      return [
                        {
                          content: mediaEmbed,
                          type: "css",
                          startIndex: 7,
                          endIndex: 44,
                          getRaw(): string { return this.content; },
                        },
                      ];
                    }

                    return [];
                  }),
                }),
                new WebManglerLanguagePluginMock({
                  getEmbeds: sinon.stub().callsFake(({ content }) => {
                    if (content === mediaEmbed) {
                      return [
                        {
                          content: cssEmbed,
                          type: "js",
                          startIndex: 15,
                          endIndex: 36,
                          getRaw(): string { return this.content; },
                        },
                      ];
                    }

                    return [];
                  }),
                }),
              ],
              expected: {
                embeds: [
                  {
                    content: cssEmbed,
                    type: "js",
                    startIndex: 15,
                    endIndex: 36,
                    getRaw(): string { return this.content; },
                  },
                  {
                    content: `@media screen {${idPattern}}`,
                    type: "css",
                    startIndex: 7,
                    endIndex: 44,
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
          ];
        },
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
              expect(plugin.getEmbeds).to.have.been.calledWith(file);
            }
          }

          expect(embeds).to.have.length(expected.embeds.length);
          for (const i in embeds) {
            const embed = embeds[i];
            const expectedEmbed = expected.embeds[i];
            const expectedContent = new RegExp(`^${expectedEmbed.content}$`);
            expect(embed.content).to.match(expectedContent);
            expect(embed.type).to.equal(expectedEmbed.type);
            expect(embed.startIndex).to.equal(expectedEmbed.startIndex);
            expect(embed.endIndex).to.equal(expectedEmbed.endIndex);
            expect(embed.getRaw()).to.match(expectedContent);
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
});
