import type { TestScenarios } from "@webmangler/testing";
import type { MangleExpression } from "@webmangler/types";

import { MangleExpressionMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import { getAllMatches } from "./test-helpers";

suite("Language Plugins Test Helpers", function() {
  suite("::getAllMatches", function() {
    interface TestCase {
      readonly expressions: ReadonlyArray<MangleExpression>;
      readonly input: string;
      readonly pattern: string;
      readonly expected: ReadonlyArray<string>;
    }

    const scenarios: TestScenarios<ReadonlyArray<TestCase>> = [
      {
        testName: "sample",
        getScenario: () => [
          {
            expressions: [
              new MangleExpressionMock({
                findAll: sinon.stub().returns(["the", "sun"]),
              }),
            ],
            input: "praise the sun",
            pattern: "[a-z]",
            expected: ["the", "sun"],
          },
          {
            expressions: [
              new MangleExpressionMock({
                findAll: sinon.stub().returns(["the", "sun"]),
              }),
              new MangleExpressionMock({
                findAll: sinon.stub().returns(["ise", "the"]),
              }),
            ],
            input: "praise the sun",
            pattern: "[a-z]",
            expected: ["the", "sun", "ise", "the"],
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const {
            expressions,
            input,
            pattern,
            expected,
          } = testCase;

          const matches = getAllMatches(expressions, input, pattern);
          expect(matches).to.deep.equal(expected);
        }
      });
    }
  });
});
