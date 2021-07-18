import type { TestScenario } from "@webmangler/testing";
import type { MangleExpression } from "@webmangler/types";

import { MangleExpressionMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import { getAllMatches } from "./test-helpers";

suite("Language Plugins Test Helpers", function() {
  suite("::getAllMatches", function() {
    type TestCase = {
      expressions: MangleExpression[];
      input: string;
      pattern: string;
      expected: string[];
    };

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "sample",
        cases: [
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

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
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
