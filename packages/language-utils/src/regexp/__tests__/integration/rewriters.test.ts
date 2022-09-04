import type { TestScenarios } from "@webmangler/testing";

import { expect } from "chai";

import {
  toCaseInsensitivePattern,
} from "../../index";

suite("::toCaseInsensitivePattern", function() {
  interface TestCase {
    readonly pattern: string;
    readonly matches: Iterable<{
      readonly s: string;
      readonly matches: Iterable<string>;
    }>;
  }

  const scenarios: TestScenarios<TestCase[]> = [
    {
      testName: "character ranges",
      getScenario: () => [
        {
          pattern: "[a-z]+",
          matches: [
            { s: "abc", matches: ["abc"] },
            { s: "abc-ABC", matches: ["abc", "ABC"] },
            { s: "123", matches: [] },
          ],
        },
        {
          pattern: "[A-Z]+",
          matches: [
            { s: "abc", matches: ["abc"] },
            { s: "ABC", matches: ["ABC"] },
            { s: "123", matches: [] },
          ],
        },
        {
          pattern: "[X-c]+",
          matches: [
            { s: "xyz", matches: ["xyz"] },
            { s: "XYZ", matches: ["XYZ"] },
            { s: "abc", matches: ["abc"] },
            { s: "ABC", matches: ["ABC"] },
            { s: "uvw xyz", matches: ["xyz"] },
            { s: "123", matches: [] },
          ],
        },
      ],
    },
    {
      testName: "words",
      getScenario: () => [
        {
          pattern: "foo",
          matches: [
            { s: "foo", matches: ["foo"] },
            { s: "Foo", matches: ["Foo"] },
            { s: "fOo", matches: ["fOo"] },
            { s: "foO", matches: ["foO"] },
            { s: "FOo", matches: ["FOo"] },
            { s: "FoO", matches: ["FoO"] },
            { s: "fOO", matches: ["fOO"] },
            { s: "FOO", matches: ["FOO"] },
            { s: "abc", matches: [] },
            { s: "123", matches: [] },
          ],
        },
        {
          pattern: "FOO",
          matches: [
            { s: "foo", matches: ["foo"] },
            { s: "Foo", matches: ["Foo"] },
            { s: "fOo", matches: ["fOo"] },
            { s: "foO", matches: ["foO"] },
            { s: "FOo", matches: ["FOo"] },
            { s: "FoO", matches: ["FoO"] },
            { s: "fOO", matches: ["fOO"] },
            { s: "FOO", matches: ["FOO"] },
            { s: "abc", matches: [] },
            { s: "123", matches: [] },
          ],
        },
      ],
    },
  ];

  for (const { getScenario, testName } of scenarios) {
    test(testName, function() {
      for (const testCase of getScenario()) {
        const { pattern, matches } = testCase;
        const result = toCaseInsensitivePattern(pattern);
        for (const entry of matches) {
          const expr = new RegExp(result, "g");
          for (const expected of entry.matches) {
            const match = expr.exec(entry.s) as RegExpExecArray;
            expect(match).not.to.be.null;
            expect(match[0]).to.equal(expected);
          }

          // Assert that there are not more matches than was expected:
          expect(expr.exec(entry.s)).to.be.null;
        }
      }
    });
  }
});
