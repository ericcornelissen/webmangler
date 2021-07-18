import type { TestScenario } from "@webmangler/testing";
import type { MangleExpression } from "@webmangler/types";

import { MangleExpressionMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import { getAllMatches } from "./test-helpers";

suite("Language Plugins Test Helpers", function() {
  suite("::getAllMatches", function() {
    type TestCase = {
      /**
       * The {@link MangleExpression}s to match with.
       */
      expressions: MangleExpression[];

      /**
       * The input string to match against.
       */
      input: string;

      /**
       * The pattern to use for matching.
       */
      pattern: string;

      /**
       * The expected matches.
       */
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
