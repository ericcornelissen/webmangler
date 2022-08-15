import type { TestScenarios } from "@webmangler/testing";
import type {
  WebManglerFile,
  WebManglerOptions,
  WebManglerPlugin,
} from "@webmangler/types";

import type { CssLanguagePluginOptions } from "../../index";

import { WebManglerPluginMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";
import webmangler from "webmangler";

import CssLanguagePlugin from "../../index";

suite("CssLanguagePlugin class", function() {
  interface TestCase {
    readonly input: {
      readonly config: CssLanguagePluginOptions;
      readonly files: WebManglerFile[];
      readonly plugins: WebManglerPlugin[];
    };
    readonly expected: {
      readonly files: WebManglerFile[];
    };
  }

  const testScenarios: TestScenarios<TestCase> = [
    {
      testName: "basic stylesheet",
      getScenario: () => {
        return {
          input: {
            config: { },
            files: [
              {
                type: "css",
                content: ".cls-foo { color: red; }",
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
                type: "css",
                content: ".a { color: red; }",
              },
            ],
          },
        };
      },
    },
    {
      testName: "stylesheet with media query",
      getScenario: () => {
        return {
          input: {
            config: { },
            files: [
              {
                type: "css",
                content: "@media screen { .cls-foo { color: red; } }",
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
                type: "css",
                content: "@media screen { .a { color: red; } }",
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
          new CssLanguagePlugin(input.config),
        ],
        plugins: input.plugins,
      };

      const result = webmangler(input.files, options);
      expect(result.files).to.deep.equal(expected.files);
    });
  }
});
