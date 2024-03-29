import type { TestScenarios } from "@webmangler/testing";
import type {
  WebManglerFile,
  WebManglerOptions,
  WebManglerPlugin,
} from "@webmangler/types";

import type { JavaScriptLanguagePluginOptions } from "../../index";

import webmangler from "@webmangler/core";
import { WebManglerPluginMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import JavaScriptLanguagePlugin from "../../index";

suite("Expressions", function() {
  interface TestCase {
    readonly input: {
      readonly config: JavaScriptLanguagePluginOptions;
      readonly files: ReadonlyArray<WebManglerFile>;
      readonly plugins: ReadonlyArray<WebManglerPlugin>;
    };
    readonly expected: {
      readonly files: ReadonlyArray<WebManglerFile>;
    };
  }

  const testScenarios: TestScenarios<TestCase> = [
    {
      testName: "attribute",
      getScenario: () => {
        const files = [
          {
            type: "js",
            content: `
              var x = document.querySelector("[data-foo]");
            `,
          },
        ];

        return {
          input: {
            config: { },
            files,
            plugins: [
              new WebManglerPluginMock({
                options: sinon.stub().returns({
                  patterns: "data-[a-z]+",
                  ignorePatterns: [],
                  charSet: ["a", "b", "c", "d", "e"],
                  manglePrefix: "data-",
                  reservedNames: [],
                  languageOptions: [
                    {
                      name: "attributes",
                      options: { },
                    },
                  ],
                }),
              }),
            ],
          },
          expected: {
            files,
          },
        };
      },
    },
    {
      testName: "css-declaration-properties",
      getScenario: () => {
        return {
          input: {
            config: { },
            files: [
              {
                type: "js",
                content: `
                  var x = el.getPropertyValue('--var-foobar');
                `,
              },
            ],
            plugins: [
              new WebManglerPluginMock({
                options: sinon.stub().returns({
                  patterns: "var-[a-z]+",
                  ignorePatterns: [],
                  charSet: ["a", "b", "c", "d", "e"],
                  manglePrefix: "var-",
                  reservedNames: [],
                  languageOptions: [
                    {
                      name: "css-declaration-properties",
                      options: {
                        prefix: "--",
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
                type: "js",
                content: `
                  var x = el.getPropertyValue('--var-a');
                `,
              },
            ],
          },
        };
      },
    },
    {
      testName: "css-declaration-values",
      getScenario: () => {
        const files = [
          {
            type: "js",
            content: `
              var foo = "bar";
            `,
          },
        ];

        return {
          input: {
            config: { },
            files,
            plugins: [
              new WebManglerPluginMock({
                options: sinon.stub().returns({
                  patterns: "[a-z]+",
                  ignorePatterns: [],
                  charSet: ["a", "b", "c", "d", "e"],
                  manglePrefix: "",
                  reservedNames: [],
                  languageOptions: [
                    {
                      name: "css-declaration-values",
                      options: {
                        prefix: "--",
                      },
                    },
                  ],
                }),
              }),
            ],
          },
          expected: {
            files,
          },
        };
      },
    },
    {
      testName: "multi-value-attributes",
      getScenario: () => {
        const files = [
          {
            type: "js",
            content: `
              var foo = document.querySelectorAll("[class='foo bar']");
            `,
          },
        ];

        return {
          input: {
            config: { },
            files,
            plugins: [
              new WebManglerPluginMock({
                options: sinon.stub().returns({
                  patterns: "cls-[a-z]+",
                  ignorePatterns: [],
                  charSet: ["a", "b", "c", "d", "e"],
                  manglePrefix: "cls-",
                  reservedNames: [],
                  languageOptions: [
                    {
                      name: "multi-value-attributes",
                      options: {
                        attributeNames: ["class"],
                      },
                    },
                  ],
                }),
              }),
            ],
          },
          expected: {
            files,
          },
        };
      },
    },
    {
      testName: "query-selectors",
      getScenario: () => {
        return {
          input: {
            config: { },
            files: [
              {
                type: "js",
                content: `
                  var foo = document.querySelectorAll(".cls-bar");
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
                type: "js",
                content: `
                  var foo = document.querySelectorAll(".a");
                `,
              },
            ],
          },
        };
      },
    },
    {
      testName: "single-value-attributes",
      getScenario: () => {
        const files = [
          {
            type: "js",
            content: `
              var foo = document.querySelectorAll("[data-foo='bar']");
            `,
          },
        ];

        return {
          input: {
            config: { },
            files,
            plugins: [
              new WebManglerPluginMock({
                options: sinon.stub().returns({
                  patterns: "id-[a-z]+",
                  ignorePatterns: [],
                  charSet: ["a", "b", "c", "d", "e"],
                  manglePrefix: "id-",
                  reservedNames: [],
                  languageOptions: [
                    {
                      name: "single-value-attributes",
                      options: {
                        attributeNames: ["id"],
                      },
                    },
                  ],
                }),
              }),
            ],
          },
          expected: {
            files,
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
          new JavaScriptLanguagePlugin(input.config),
        ],
        plugins: [...input.plugins],
      };

      const result = webmangler([...input.files], options);
      expect(result.files).to.deep.equal(expected.files);
    });
  }
});
