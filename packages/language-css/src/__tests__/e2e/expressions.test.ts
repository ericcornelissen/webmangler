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

import HtmlLanguagePlugin from "../../index";

suite("Expressions", function() {
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
      testName: "attribute",
      getScenario: () => {
        const files = [
          {
            type: "css",
            content: `
              #foo.bar[hello="world"] {
                color: red;
                background: purple;
              }
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
                type: "css",
                content: `
                  :root {
                    --right: 3px;
                    --top: 1px;
                    --bottom: 4px;
                  }
                  .foobar {
                    --left: 4px;
                    --top: 2px;

                    margin-right: 42px;
                    margin-top: var(--top);
                  }
                `,
              },
            ],
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
                type: "css",
                content: `
                  :root {
                    --b: 3px;
                    --a: 1px;
                    --c: 4px;
                  }
                  .foobar {
                    --d: 4px;
                    --a: 2px;

                    margin-right: 42px;
                    margin-top: var(--top);
                  }
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
        return {
          input: {
            config: { },
            files: [
              {
                type: "css",
                content: `
                  :root {
                    --right: 4px;
                    --top: 2px;
                  }
                  .foobar {
                    margin-right: var(--right);
                    margin-top: var(--top);
                  }
                `,
              },
            ],
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
            files: [
              {
                type: "css",
                content: `
                  :root {
                    --right: 4px;
                    --top: 2px;
                  }
                  .foobar {
                    margin-right: var(--a);
                    margin-top: var(--b);
                  }
                `,
              },
            ],
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
                type: "css",
                content: `
                  #foo[class="foo bar"] {
                    color: red;
                  }
                  .bar[data-test='hello world'] {
                    color: white;
                  }
                  .no[data-test=quotes] {
                    color: blue;
                  }
                `,
              },
            ],
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
                      name: "multi-value-attributes",
                      options: {
                        attributeNames: ["class", "data-test"],
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
                content: `
                  #foo[class="a b"] {
                    color: red;
                  }
                  .bar[data-test='c d'] {
                    color: white;
                  }
                  .no[data-test=e] {
                    color: blue;
                  }
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
        return {
          input: {
            config: { },
            files: [
              {
                type: "css",
                content: `
                  [data-foobar] { }
                  .cls-foobar { }
                  div { }
                  #id-foobar { }
                `,
              },
            ],
            plugins: [
              new WebManglerPluginMock({
                options: sinon.stub().returns([
                  {
                    patterns: "data-[a-z]+",
                    ignorePatterns: [],
                    charSet: ["a", "b", "c", "d", "e"],
                    manglePrefix: "data-",
                    reservedNames: [],
                    languageOptions: [
                      {
                        name: "query-selectors",
                        options: {
                          kind: "attribute",
                        },
                      },
                    ],
                  },
                  {
                    patterns: "cls-[a-z]+",
                    ignorePatterns: [],
                    charSet: ["a", "b", "c", "d", "e"],
                    manglePrefix: "cls-",
                    reservedNames: [],
                    languageOptions: [
                      {
                        name: "query-selectors",
                        options: {
                          kind: "class",
                        },
                      },
                    ],
                  },
                  {
                    patterns: "[a-z]+",
                    ignorePatterns: [],
                    charSet: ["a", "b", "c", "d", "e"],
                    manglePrefix: "",
                    reservedNames: [],
                    languageOptions: [
                      {
                        name: "query-selectors",
                        options: {
                          kind: "element",
                        },
                      },
                    ],
                  },
                  {
                    patterns: "id-[a-z]+",
                    ignorePatterns: [],
                    charSet: ["a", "b", "c", "d", "e"],
                    manglePrefix: "id-",
                    reservedNames: [],
                    languageOptions: [
                      {
                        name: "query-selectors",
                        options: {
                          kind: "id",
                        },
                      },
                    ],
                  },
                ]),
              }),
            ],
          },
          expected: {
            files: [
              {
                type: "css",
                content: `
                  [data-a] { }
                  .cls-a { }
                  a { }
                  #id-a { }
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
        return {
          input: {
            config: { },
            files: [
              {
                type: "css",
                content: `
                  #foo[id="foobar"] {
                    color: red;
                  }
                  .bar[id='helloworld'] {
                    color: white;
                  }
                  .no[id=quotes] {
                    color: blue;
                  }
                `,
              },
            ],
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
                type: "css",
                content: `
                  #foo[id="a"] {
                    color: red;
                  }
                  .bar[id='b'] {
                    color: white;
                  }
                  .no[id=c] {
                    color: blue;
                  }
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
