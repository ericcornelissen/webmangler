import type { MangleExpression, WebManglerFile } from "@webmangler/types";

import { MangleExpressionMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import {
  doMangle,
} from "../../replace";

suite("ManglerEngine replace", function() {
  suite("::doMangle", function() {
    interface TestScenario {
      readonly testName: string;
      readonly getTestCases: () => Iterable<{
        readonly files: WebManglerFile[];
        readonly expressions: Map<string, Iterable<MangleExpression>>;
        readonly mangleMap: Map<string, string>;
        readonly expected: WebManglerFile[];
      }>;
    }

    const scenarios: Iterable<TestScenario> = [
      {
        testName: "no files",
        getTestCases: () => [
          {
            files: [],
            expressions: new Map([
              ["js", [new MangleExpressionMock()]],
            ]),
            mangleMap: new Map([
              ["foobar", "a"],
            ]),
            expected: [],
          },
        ],
      },
      {
        testName: "no expressions",
        getTestCases: () => {
          const files = [
            {
              type: "js",
              content: "var x = 3;",
            },
          ];

          return [
            {
              files,
              expressions: new Map(),
              mangleMap: new Map([
                ["foobar", "a"],
              ]),
              expected: files,
            },
            {
              files,
              expressions: new Map([
                ["css", new MangleExpressionMock()],
              ]),
              mangleMap: new Map([
                ["foobar", "a"],
              ]),
              expected: files,
            },
          ];
        },
      },
      {
        testName: "mangle things",
        getTestCases: () => {
          const cssExpression = new MangleExpressionMock({
            replaceAll: sinon.stub().returns(".a { color: red; }"),
          });
          const jsExpression = new MangleExpressionMock({
            replaceAll: sinon.stub().returns("var x = 'a';"),
          });

          const cssFile = {
            type: "css",
            content: ".foobar { color: red; }",
          };
          const jsFile = {
            type: "js",
            content: "var x = 'foobar';",
          };

          return [
            {
              files: [cssFile, jsFile],
              expressions: new Map([
                ["js", [jsExpression]],
              ]),
              mangleMap: new Map([
                ["foobar", "a"],
              ]),
              expected: [
                cssFile,
                {
                  type: "js",
                  content: "var x = 'a';",
                },
              ],
            },
            {
              files: [cssFile, jsFile],
              expressions: new Map([
                ["css", [cssExpression]],
              ]),
              mangleMap: new Map([
                ["foobar", "a"],
              ]),
              expected: [
                {
                  type: "css",
                  content: ".a { color: red; }",
                },
                jsFile,
              ],
            },
            {
              files: [cssFile, jsFile],
              expressions: new Map([
                ["js", [jsExpression]],
                ["css", [cssExpression]],
              ]),
              mangleMap: new Map([
                ["foobar", "a"],
              ]),
              expected: [
                {
                  type: "css",
                  content: ".a { color: red; }",
                },
                {
                  type: "js",
                  content: "var x = 'a';",
                },
              ],
            },
          ];
        },
      },
    ];

    for (const { testName, getTestCases } of scenarios) {
      test(testName, function() {
        for (const testCase of getTestCases()) {
          const { files, expressions, mangleMap, expected } = testCase;
          const result = doMangle(files, expressions, mangleMap);
          expect(result).to.deep.equal(expected);
        }
      });
    }
  });
});
