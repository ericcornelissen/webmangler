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
          const replaceAllCss = sinon.stub();
          const replaceAllJs = sinon.stub();

          const expectedMap = new Map([
            ["foobar", "a"],
          ]);

          replaceAllCss.withArgs(
            ".foobar { color: red; }",
            sinon.match.map.contains(expectedMap),
          ).returns(".a { color: red; }");
          replaceAllCss.withArgs(
            ".a { color: red; }",
            sinon.match.map.contains(expectedMap),
          ).returns(".a { color: red; }");
          replaceAllCss.withArgs(
            sinon.match.string,
            sinon.match.map.deepEquals(new Map()),
          ).returnsArg(0);

          const cssExpression = new MangleExpressionMock({
            replaceAll: replaceAllCss,
          });

          replaceAllJs.withArgs(
            "var x = 'foobar';",
            sinon.match.map.contains(expectedMap),
          ).returns("var x = 'a';");
          replaceAllJs.withArgs(
            "var x = 'a';",
            sinon.match.map.contains(expectedMap),
          ).returns("var x = 'a';");
          replaceAllJs.withArgs(
            sinon.match.string,
            sinon.match.map.deepEquals(new Map()),
          ).returnsArg(0);

          const jsExpression = new MangleExpressionMock({
            replaceAll: replaceAllJs,
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
      {
        testName: "mangle 'x' |-> 'x'",
        getTestCases: () => {
          const replaceAll = sinon.stub();
          replaceAll.withArgs(
            ".a { color: red; }",
            sinon.match.map.deepEquals(new Map()),
          ).returns(".a { color: red; }");

          const cssExpression = new MangleExpressionMock({
            replaceAll,
          });

          const cssFile = {
            type: "css",
            content: ".a { color: red; }",
          };

          return [
            {
              files: [cssFile],
              expressions: new Map([
                ["css", [cssExpression]],
              ]),
              mangleMap: new Map([
                ["a", "a"],
              ]),
              expected: [
                cssFile,
              ],
            },
          ];
        },
      },
      {
        testName: "mangle 'a' |-> 'b' and 'b' |-> 'c'",
        getTestCases: () => {
          const cssFile = {
            type: "css",
            content: ".foo { } .bar { }",
          };

          const replaceAll = sinon.stub();
          replaceAll.withArgs(
            ".foo { } .bar { }",
            sinon.match.map.contains(new Map([
              ["foo", "a"],
              ["bar", "baz"],
            ])),
          ).returns(".a { } .baz { }");
          replaceAll.withArgs(
            ".a { } .baz { }",
            sinon.match.map.contains(new Map([
              ["a", "bar"],
            ])),
          ).returns(".bar { } .baz { }");

          const cssExpression = new MangleExpressionMock({
            replaceAll,
          });

          return [
            {
              files: [cssFile],
              expressions: new Map([
                ["css", [cssExpression]],
              ]),
              mangleMap: new Map([
                ["foo", "bar"],
                ["bar", "baz"],
              ]),
              expected: [
                {
                  type: "css",
                  content: ".bar { } .baz { }",
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
          const { files, expressions, mangleMap } = testCase;
          const expected = testCase.expected.map(
            (file) => Object.assign({ }, file),
          );

          const result = doMangle(files, expressions, mangleMap);
          expect(result).to.deep.equal(expected);
        }
      });
    }
  });
});
