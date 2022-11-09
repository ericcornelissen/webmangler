import type { TestScenarios } from "@webmangler/testing";
import type {
  WebManglerFile,
  WebManglerOptions,
  WebManglerPlugin,
} from "@webmangler/types";
import type { CssLanguagePluginOptions } from "@webmangler/language-css";
import type { JavaScriptLanguagePluginOptions } from "@webmangler/language-js";

import type { HtmlLanguagePluginOptions } from "../../index";

import webmangler from "@webmangler/core";
import { WebManglerPluginMock } from "@webmangler/testing";
import CssLanguagePlugin from "@webmangler/language-css";
import JavaScriptLanguagePlugin from "@webmangler/language-js";
import { expect } from "chai";
import * as sinon from "sinon";

import HtmlLanguagePlugin from "../../index";

suite("Embeds", function() {
  suite("CSS", function() {
    interface TestCase {
      readonly input: {
        readonly config: {
          readonly cssPlugin: CssLanguagePluginOptions;
          readonly htmlPlugin: HtmlLanguagePluginOptions;
        };
        readonly files: ReadonlyArray<Readonly<WebManglerFile>>;
        readonly plugins: ReadonlyArray<WebManglerPlugin>;
      };
      readonly expected: {
        readonly files: ReadonlyArray<Readonly<WebManglerFile>>;
      };
    }

    const testScenarios: TestScenarios<TestCase> = [
      {
        testName: "basic stylesheet",
        getScenario: () => {
          return {
            input: {
              config: {
                cssPlugin: { },
                htmlPlugin: { },
              },
              files: [
                {
                  type: "html",
                  content: `
                    <html>
                      <head>
                        <style>
                          .cls-foo { color: red; }
                        </style>
                      </head>
                    </html>
                  `,
                },
              ],
              plugins: [
                new WebManglerPluginMock({
                  options: sinon.stub().returns({
                    patterns: "cls-[a-z]+",
                    ignorePatterns: [],
                    charSet: ["a", "b", "c", "d", "e"],
                    manglePrefix: "",
                    reservedNames: [],
                    languageOptions: [
                      {
                        name: "query-selectors",
                        options: {
                          prefix: "\\.",
                        },
                      },
                    ],
                  }),
                }),
              ],
            },
            expected: {
              files: [
                {
                  type: "html",
                  content: `
                    <html>
                      <head>
                        <style>
                          .a { color: red; }
                        </style>
                      </head>
                    </html>
                  `,
                },
              ],
            },
          };
        },
      },
    ];

    for (const { testName, getScenario } of testScenarios) {
      test(testName, function() {
        const { input, expected } = getScenario();

        const options: WebManglerOptions = {
          languages: [
            new HtmlLanguagePlugin(input.config.htmlPlugin),
            new CssLanguagePlugin(input.config.cssPlugin),
          ],
          plugins: [...input.plugins],
        };

        const result = webmangler([...input.files], options);
        expect(result.files).to.deep.equal(expected.files);
      });
    }
  });

  suite("JavaScript", function() {
    interface TestCase {
      readonly input: {
        readonly config: {
          readonly htmlPlugin: HtmlLanguagePluginOptions;
          readonly jsPlugin: JavaScriptLanguagePluginOptions;
        };
        readonly files: ReadonlyArray<Readonly<WebManglerFile>>;
        readonly plugins: ReadonlyArray<WebManglerPlugin>;
      };
      readonly expected: {
        readonly files: ReadonlyArray<Readonly<WebManglerFile>>;
      };
    }

    const testScenarios: TestScenarios<TestCase> = [
      {
        testName: "basic stylesheet",
        getScenario: () => {
          return {
            input: {
              config: {
                htmlPlugin: { },
                jsPlugin: { },
              },
              files: [
                {
                  type: "html",
                  content: `
                    <html>
                      <head>
                        <script>
                          var x = document.querySelectorAll(".cls-foo");
                        </script>
                      </head>
                    </html>
                  `,
                },
              ],
              plugins: [
                new WebManglerPluginMock({
                  options: sinon.stub().returns({
                    patterns: "cls-[a-z]+",
                    ignorePatterns: [],
                    charSet: ["a", "b", "c", "d", "e"],
                    manglePrefix: "",
                    reservedNames: [],
                    languageOptions: [
                      {
                        name: "query-selectors",
                        options: {
                          prefix: "\\.",
                        },
                      },
                    ],
                  }),
                }),
              ],
            },
            expected: {
              files: [
                {
                  type: "html",
                  content: `
                    <html>
                      <head>
                        <script>
                          var x = document.querySelectorAll(".a");
                        </script>
                      </head>
                    </html>
                  `,
                },
              ],
            },
          };
        },
      },
    ];

    for (const { testName, getScenario } of testScenarios) {
      test(testName, function() {
        const { input, expected } = getScenario();

        const options: WebManglerOptions = {
          languages: [
            new HtmlLanguagePlugin(input.config.htmlPlugin),
            new JavaScriptLanguagePlugin(input.config.jsPlugin),
          ],
          plugins: [...input.plugins],
        };

        const result = webmangler([...input.files], options);
        expect(result.files).to.deep.equal(expected.files);
      });
    }
  });
});
