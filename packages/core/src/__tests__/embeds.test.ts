import type { TestScenario } from "@webmangler/testing";

import type { IdentifiableWebManglerEmbed } from "../embeds";
import type {
  WebManglerEmbed,
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "../types";

import { WebManglerPluginLanguageMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import { getEmbeds, reEmbed } from "../embeds";

suite("Embeds", function() {
  suite("::getEmbeds", function() {
    type TestCase = {
      readonly files: WebManglerFile[];
      readonly plugins: WebManglerLanguagePlugin[];
      readonly expected: {
        readonly embeds: WebManglerEmbed[];
        readonly files: WebManglerFile[];
      };
    };

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "sample",
        cases: [
          {
            files: [
              {
                type: "html",
                content: "<style>.foobar { color: red; }</style>",
              },
            ],
            plugins: [
              new WebManglerPluginLanguageMock({
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
                  content: "<style>\\[.+\\]</style>",
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
              new WebManglerPluginLanguageMock({
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
                  content: "<script>\\[.+\\]</script>",
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
              new WebManglerPluginLanguageMock({
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
                  content: "<style>\\[.+\\]</style>" +
                    "<script>\\[.+\\]</script>",
                },
              ],
            },
          },
        ],
      },
      {
        name: "edge cases",
        cases: [
          {
            files: [],
            plugins: [
              new WebManglerPluginLanguageMock(),
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

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
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
            expect(file.content).to.match(new RegExp(expectedFile.content));
            expect(file.type).to.equal(expectedFile.type);
          }
        }
      });
    }
  });

  suite("::reEmbed", function() {
    type TestCase = {
      readonly embeds: IdentifiableWebManglerEmbed[];
      readonly file: WebManglerFile;
      readonly expected: string;
    }

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "sample",
        cases: [
          {
            embeds: [
              {
                content: "var foo = \"bar\";",
                type: "js",
                startIndex: 3,
                endIndex: 14,
                getRaw(): string { return this.content; },
                id: "[1234567890]",
              },
            ],
            file: {
              type: "html",
              content: "<script>[1234567890]</script>",
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
                id: "[0987654321]",
              },
            ],
            file: {
              type: "html",
              content: "<div style=\"[0987654321]\"></div>",
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
                id: "[12345]",
              },
              {
                content: "var foo = \"bar\";",
                type: "js",
                startIndex: 2,
                endIndex: 72,
                getRaw(): string { return this.content; },
                id: "[67890]",
              },
            ],
            file: {
              type: "html",
              content: "<style>[12345]</style>" +
                "<script>[67890]</script>",
            },
            expected: "<style>.foo { font: serif; }</style>" +
              "<script>var foo = \"bar\";</script>",
          },
        ],
      },
      {
        name: "edge cases",
        cases: [
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

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const { embeds, expected, file } = testCase;

          reEmbed(embeds, file);
          expect(file.content).to.equal(expected);
        }
      });
    }
  });
});
