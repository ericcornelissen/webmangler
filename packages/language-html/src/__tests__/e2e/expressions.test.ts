import type { TestScenarios } from "@webmangler/testing";
import type {
  WebManglerFile,
  WebManglerOptions,
  WebManglerPlugin,
} from "@webmangler/types";

import type { HtmlLanguagePluginOptions } from "../../index";

import { WebManglerPluginMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";
import webmangler from "webmangler";

import HtmlLanguagePlugin from "../../index";

suite("Expressions", function() {
  interface TestCase {
    readonly input: {
      readonly config: HtmlLanguagePluginOptions;
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
        return {
          input: {
            config: { },
            files: [
              {
                type: "html",
                content: `
                  <html>
                    <head>
                      <title>Foobar</title>
                    </head>
                    <body>
                      <h1 data-foo>Hello world!</h1>
                    </body>
                  </html>
                `,
              },
            ],
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
            files: [
              {
                type: "html",
                content: `
                  <html>
                    <head>
                      <title>Foobar</title>
                    </head>
                    <body>
                      <h1 data-a>Hello world!</h1>
                    </body>
                  </html>
                `,
              },
            ],
          },
        };
      },
    },
    {
      testName: "css-declaration-properties",
      getScenario: () => {
        const files = [
          {
            type: "html",
            content: `
              <html>
                <head>
                  <title>Foobar</title>
                </head>
                <body>
                <h1 data-style="color: red">Hello world!</h1>
                </body>
              </html>
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
                      name: "css-declaration-properties",
                      options: {
                        prefix: "margin-",
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
      testName: "css-declaration-values",
      getScenario: () => {
        const files = [
          {
            type: "html",
            content: `
              <html>
                <head>
                  <title>Foobar</title>
                </head>
                <body>
                  <h1 data-style="color: red">Hello world!</h1>
                </body>
              </html>
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
        return {
          input: {
            config: { },
            files: [
              {
                type: "html",
                content: `
                  <html>
                    <head>
                      <title>Foobar</title>
                    </head>
                    <body>
                      <h1 class="cls-foo cls-bar">Hello world!</h1>
                    </body>
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
            files: [
              {
                type: "html",
                content: `
                  <html>
                    <head>
                      <title>Foobar</title>
                    </head>
                    <body>
                      <h1 class="cls-a cls-b">Hello world!</h1>
                    </body>
                  </html>
                `,
              },
            ],
          },
        };
      },
    },
    {
      testName: "query-selectors",
      getScenario: () => {
        const files = [
          {
            type: "html",
            content: `
              <html>
                <head>
                  <title>Foobar</title>
                </head>
                <body>
                  <h1 class="cls-foo">Hello world!</h1>
                </body>
              </html>
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
            files,
          },
        };
      },
    },
    {
      testName: "single-value-attributes",
      getScenario: () => {
        return {
          input: {
            config: { },
            files: [
              {
                type: "html",
                content: `
                  <html>
                    <head>
                      <title>Foobar</title>
                    </head>
                    <body>
                      <h1 id="id-foobar">Hello world!</h1>
                    </body>
                  </html>
                `,
              },
            ],
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
            files: [
              {
                type: "html",
                content: `
                  <html>
                    <head>
                      <title>Foobar</title>
                    </head>
                    <body>
                      <h1 id="id-a">Hello world!</h1>
                    </body>
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
          new HtmlLanguagePlugin(input.config),
        ],
        plugins: [...input.plugins],
      };

      const result = webmangler([...input.files], options);
      expect(result.files).to.deep.equal(expected.files);
    });
  }
});
