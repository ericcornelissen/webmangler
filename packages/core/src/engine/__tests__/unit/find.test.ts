import type { MangleExpression, WebManglerFile } from "@webmangler/types";

import { MangleExpressionMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import {
  countInstances,
} from "../../find";

suite("ManglerEngine find", function() {
  suite("::countInstances", function() {
    interface TestScenario {
      readonly testName: string;
      readonly getTestCases: () => Iterable<{
        readonly files: WebManglerFile[];
        readonly finders: Map<string, Iterable<MangleExpression>>;
        readonly patterns: Iterable<string>;
        readonly expected: Map<string, number>;
      }>;
    }

    const scenarios: Iterable<TestScenario> = [
      {
        testName: "no files",
        getTestCases: () => [
          {
            files: [],
            finders: new Map([
              ["js", [new MangleExpressionMock()]],
            ]),
            patterns: ["fo+", "ba(r|z)"],
            expected: new Map(),
          },
        ],
      },
      {
        testName: "no patterns",
        getTestCases: () => [
          {
            files: [
              { content: "Hello world!", type: "html" },
            ],
            finders: new Map([
              ["html", [new MangleExpressionMock()]],
            ]),
            patterns: [],
            expected: new Map(),
          },
        ],
      },
      {
        testName: "no finders for file",
        getTestCases: () => [
          {
            files: [
              { content: "Hello world!", type: "html" },
            ],
            finders: new Map(),
            patterns: ["fo+", "ba(r|z)"],
            expected: new Map(),
          },
          {
            files: [
              { content: "Hello world!", type: "html" },
            ],
            finders: new Map([
              ["js", [new MangleExpressionMock()]],
            ]),
            patterns: ["fo+", "ba(r|z)"],
            expected: new Map(),
          },
          {
            files: [
              { content: "Hello world!", type: "html" },
            ],
            finders: new Map([
              ["html", []],
            ]),
            patterns: ["fo+", "ba(r|z)"],
            expected: new Map(),
          },
        ],
      },
      {
        testName: "find things",
        getTestCases: () => [
          {
            files: [
              { content: "hello world!", type: "html" },
            ],
            finders: new Map([
              ["html", [
                new MangleExpressionMock({
                  findAll: sinon.stub().callsFake((content, pattern) => {
                    if (content === "hello world!" && pattern === "[a-z]+") {
                      return ["hello", "world"];
                    }

                    return [];
                  }),
                }),
              ]],
            ]),
            patterns: ["[a-z]+"],
            expected: new Map([
              ["hello", 1],
              ["world", 1],
            ]),
          },
        ],
      },
    ];

    for (const { testName, getTestCases } of scenarios) {
      test(testName, function() {
        for (const testCase of getTestCases()) {
          const { files, finders, patterns, expected } = testCase;
          const result = countInstances(files, finders, patterns);
          expect(result).to.deep.equal(expected);
        }
      });
    }
  });
});
