import type { TestScenarios } from "@webmangler/testing";
import type {
  WebManglerFile,
  WebManglerOptions,
  WebManglerPlugin,
} from "@webmangler/types";

import type { CssLanguagePluginOptions } from "../../index";

import webmangler from "@webmangler/core";
import { WebManglerPluginMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import CssLanguagePlugin from "../../index";

suite("CssLanguagePlugin class", function() {
  interface TestCase {
    readonly input: {
      readonly config: CssLanguagePluginOptions;
      readonly files: ReadonlyArray<WebManglerFile>;
      readonly plugins: ReadonlyArray<WebManglerPlugin>;
    };
    readonly expected: {
      readonly files: ReadonlyArray<WebManglerFile>;
    };
  }

  const testScenarios: TestScenarios<TestCase> = [
    {
      testName: "no embeds",
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
        plugins: [...input.plugins],
      };

      const result = webmangler([...input.files], options);
      expect(result.files).to.deep.equal(expected.files);
    });
  }
});
