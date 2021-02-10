import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import ManglerMatch from "../mangler-match.class";

interface TestCase {
  groups?: { [key: string]: string },
  input: string,
  matched: string,
  matches: string[],
}

suite("ManglerMatch", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "foobar",
          matched: "foobar",
          matches: ["foo", "bar"],
        },
        {
          input: "foobar",
          matched: "foobar",
          matches: ["foo", "bar"],
          groups: {
            "first": "foo",
            "the-second": "bar",
          },
        },
        {
          input: "Hello world!",
          matched: "lo world!",
          matches: ["world", "!"],
          groups: {
            "location": "world",
          },
        },
      ],
    },
  ];

  suite("::fromExec", function() {
    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const { input, matched, matches, groups } = testCase;

          const rawMatch = mockMatchFromExec(input, matched, matches, groups);
          const match = ManglerMatch.fromExec(rawMatch);

          expect(match.getMatchedStr()).to.equal(matched);

          for (let i = 1; i < (matches.length + 1); i++) {
            expect(match.getGroup(i)).to.equal(matches[i - 1]);
          }

          for (const name in groups) {
            expect(match.getNamedGroup(name)).to.equal(groups[name]);
          }
        }
      });
    }

    test("get group at index that is too large", function() {
      const testCase: TestCase = scenarios[0].cases[0];
      const { input, matched, matches, groups } = testCase;

      const rawMatch = mockMatchFromExec(input, matched, matches, groups);
      const match = ManglerMatch.fromExec(rawMatch);
      expect(match.getGroup(matches.length + 2)).to.equal("");
    });

    test("get group at index that is too small", function() {
      const testCase: TestCase = scenarios[0].cases[0];
      const { input, matched, matches, groups } = testCase;

      const rawMatch = mockMatchFromExec(input, matched, matches, groups);
      const match = ManglerMatch.fromExec(rawMatch);
      expect(match.getGroup(-1)).to.equal("");
    });

    test("get non-existent named group", function() {
      const testCase: TestCase = scenarios[0].cases[0];
      const { input, matched, matches, groups } = testCase;

      const rawMatch = mockMatchFromExec(input, matched, matches, groups);
      const match = ManglerMatch.fromExec(rawMatch);
      expect(match.getNamedGroup("definitely not a group name")).to.equal("");
    });
  });

  suite("::fromReplace", function() {
    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const { matched, matches, groups } = testCase;

          const rawMatch = mockMatchFromReplace(matched, matches, groups);
          const match = ManglerMatch.fromReplace(rawMatch);

          for (let i = 1; i < (matches.length + 1); i++) {
            expect(match.getGroup(i)).to.equal(matches[i - 1]);
          }

          for (const name in groups) {
            expect(match.getNamedGroup(name)).to.equal(groups[name]);
          }
        }
      });
    }
  });

  test("get group at index that is too large", function() {
    const testCase: TestCase = scenarios[0].cases[0];
    const { matched, matches, groups } = testCase;

    const rawMatch = mockMatchFromReplace(matched, matches, groups);
    const match = ManglerMatch.fromReplace(rawMatch);
    expect(match.getGroup(matches.length + 2)).to.equal("");
  });

  test("get group at index that is too small", function() {
    const testCase: TestCase = scenarios[0].cases[0];
    const { matched, matches, groups } = testCase;

    const rawMatch = mockMatchFromReplace(matched, matches, groups);
    const match = ManglerMatch.fromReplace(rawMatch);
    expect(match.getGroup(-1)).to.equal("");
  });

  test("get non-existent named group", function() {
    const testCase: TestCase = scenarios[0].cases[0];
    const { matched, matches, groups } = testCase;

    const rawMatch = mockMatchFromReplace(matched, matches, groups);
    const match = ManglerMatch.fromReplace(rawMatch);
    expect(match.getNamedGroup("definitely not a group name")).to.equal("");
  });
});

/**
 * Create a mock {@link RegExpExecArray} instance for testing purposes.
 *
 * @param input The `input` string of the {@link RegExpExecArray}.
 * @param matched The matched part of the `input`.
 * @param matches The unnamed matches of the {@link RegExpExecArray}.
 * @param groups The named matches of the {@link RegExpExecArray}.
 * @returns An object representing a {@link RegExpExecArray}.
 */
function mockMatchFromExec(
  input: string,
  matched: string,
  matches: string[],
  groups: { [key: string]: string } = {},
): RegExpExecArray {
  return Object.assign(
    {},
    [matched, ...matches],
    { input, groups, index: 0 },
  );
}

/**
 * Create a mock of the arguments provided to the callback option of
 * `String.prototype.replace` for testing purposes.
 *
 * @param matched The matched part of the `input`.
 * @param matches The unnamed matches.
 * @param groups The named matches.
 * @returns An array representing a `String.prototype.replace` match.
 */
function mockMatchFromReplace(
  matched: string,
  matches: string[],
  groups: { [key: string]: string } = {},
): string[] {
  return [
    matched,
    ...matches,
    (groups as unknown as string),
  ];
}
