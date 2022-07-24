import type { TestScenarios } from "@webmangler/testing";

import { expect } from "chai";

import SingleGroupMangleExpression from "../../single-group.class";

suite("SingleGroupMangleExpression", function() {
  test("without the capturing group", function() {
    const expectedMessage = "Missing CAPTURE_GROUP from patternTemplate";

    expect(() => {
      new SingleGroupMangleExpression({
        patternTemplate: "",
      });
    }).to.throw(expectedMessage);
  });

  suite("::findAll", function() {
    type TestCase = Iterable<{
      patternTemplate: string;
      caseSensitive?: boolean;
      pattern: string;
      s: string;
      expected: string[];
    }>;

    const scenarios: TestScenarios<TestCase> = [
      {
        testName: "sample",
        getScenario: () => [
          {
            patternTemplate: SingleGroupMangleExpression.CAPTURE_GROUP,
            caseSensitive: true,
            pattern: "\\-[a-z]+",
            s: "foo-bar",
            expected: ["-bar"],
          },
          {
            patternTemplate: `
              (?<=\\-)
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "foo-bar",
            expected: ["bar"],
          },
          {
            patternTemplate: `
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
              (?=\\-)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "foo-bar",
            expected: ["foo"],
          },
        ],
      },
      {
        testName: "default case sensitivity",
        getScenario: () => [
          {
            patternTemplate: `
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
              (?=\\-)
            `.replace(/\s/g, ""),
            pattern: "[a-z]+",
            s: "foo-bar",
            expected: ["foo"],
          },
          {
            patternTemplate: SingleGroupMangleExpression.CAPTURE_GROUP,
            pattern: "\\-[A-Za-z]+",
            s: "foo-bar hello-World",
            expected: ["-bar", "-World"],
          },
        ],
      },
      {
        testName: "pattern with newlines",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=\\-)
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
            `,
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "foo-bar",
            expected: ["bar"],
          },
          {
            patternTemplate: `
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
              (?=\\-)
            `,
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "foo-bar",
            expected: ["foo"],
          },
        ],
      },
      {
        testName: "case sensitive",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=\\-)
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "[A-Za-z]+",
            s: "foo-BAR",
            expected: ["BAR"],
          },
          {
            patternTemplate: `
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
              (?=\\-)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "[A-Za-z]+",
            s: "Foo-bar",
            expected: ["Foo"],
          },
        ],
      },
      {
        testName: "case insensitive",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=\\-)
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
            `.replace(/\s/g, ""),
            caseSensitive: false,
            pattern: "[a-z]+",
            s: "foo-BAR",
            expected: ["bar"],
          },
          {
            patternTemplate: `
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
              (?=\\-)
            `.replace(/\s/g, ""),
            caseSensitive: false,
            pattern: "[a-z]+",
            s: "Foo-bar",
            expected: ["foo"],
          },
        ],
      },
      {
        testName: "matching another group",
        getScenario: () => [
          {
            patternTemplate: `
              (?:
                (?:foobar)
                |
                ${SingleGroupMangleExpression.CAPTURE_GROUP}
              )
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "foobar",
            expected: [],
          },
        ],
      },
      {
        testName: "corner cases",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=\\-)
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "",
            expected: [],
          },
          {
            patternTemplate: `
              (?<=\\-)
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "var m = new Map();",
            expected: [],
          },
        ],
      },
    ];

    for (const { testName, getScenario } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const {
            patternTemplate,
            caseSensitive,
            pattern,
            s,
            expected,
          } = testCase;

          const subject = new SingleGroupMangleExpression({
            patternTemplate,
            caseSensitive,
          });

          let i = 0;
          for (const str of subject.findAll(s, pattern)) {
            expect(str).to.equal(expected[i]);
            i++;
          }

          expect(i).to.equal(expected.length);
        }
      });
    }
  });

  suite("::replaceAll", function() {
    type TestCase = Iterable<{
      patternTemplate: string;
      caseSensitive: boolean;
      replacements: Map<string, string>;
      s: string;
      expected: string;
    }>;

    const scenarios: TestScenarios<TestCase> = [
      {
        testName: "sample",
        getScenario: () => [
          {
            patternTemplate: SingleGroupMangleExpression.CAPTURE_GROUP,
            caseSensitive: true,
            replacements: new Map([
              ["bar", "baz"],
            ]),
            s: "foo-bar",
            expected: "foo-baz",
          },
          {
            patternTemplate: `
              (?<=\\-)
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["foo", "oof"],
              ["bar", "baz"],
            ]),
            s: "foo-bar",
            expected: "foo-baz",
          },
          {
            patternTemplate: `
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
              (?=\\!)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["world", "mundo"],
              ["planet", "planeta"],
            ]),
            s: "Hello world! Hey planet!",
            expected: "Hello mundo! Hey planeta!",
          },
        ],
      },
      {
        testName: "case sensitive",
        getScenario: () => [
          {
            patternTemplate: SingleGroupMangleExpression.CAPTURE_GROUP,
            caseSensitive: true,
            replacements: new Map([
              ["BAR", "b"],
            ]),
            s: "foo-BAR",
            expected: "foo-b",
          },
          {
            patternTemplate: `
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
              (?=\\!)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["World", "mundo"],
              ["planet", "planeta"],
            ]),
            s: "Hello World! Hey PLANET!",
            expected: "Hello mundo! Hey PLANET!",
          },
        ],
      },
      {
        testName: "case insensitive",
        getScenario: () => [
          {
            patternTemplate: SingleGroupMangleExpression.CAPTURE_GROUP,
            caseSensitive: false,
            replacements: new Map([
              ["bar", "baz"],
            ]),
            s: "foo-BAR",
            expected: "foo-baz",
          },
          {
            patternTemplate: `
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
              (?=\\!)
            `.replace(/\s/g, ""),
            caseSensitive: false,
            replacements: new Map([
              ["world", "mundo"],
              ["planet", "planeta"],
            ]),
            s: "Hello World! Hey PLANET!",
            expected: "Hello mundo! Hey planeta!",
          },
        ],
      },
      {
        testName: "matching another group",
        getScenario: () => [
          {
            patternTemplate: `
              (?:
                (?:foobar)
                |
                ${SingleGroupMangleExpression.CAPTURE_GROUP}
              )
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["foobar", "foobaz"],
            ]),
            s: "foobar",
            expected: "foobar",
          },
        ],
      },
      {
        testName: "corner cases",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=\\-)
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map(),
            s: "",
            expected: "",
          },
          {
            patternTemplate: `
              (?<=\\-)
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map(),
            s: "foo-bar",
            expected: "foo-bar",
          },
          {
            patternTemplate: `
              (?<=\\-)
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["foo", "bar"],
            ]),
            s: "",
            expected: "",
          },
          {
            patternTemplate: `
              (?<=\\-)
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["foo", "bar"],
            ]),
            s: "",
            expected: "",
          },
          {
            patternTemplate: `
              (?<=\\-)
              ${SingleGroupMangleExpression.CAPTURE_GROUP}
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["foo", "bar"],
            ]),
            s: "var m = new Map();",
            expected: "var m = new Map();",
          },
        ],
      },
    ];

    for (const { testName, getScenario } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const {
            patternTemplate,
            caseSensitive,
            replacements,
            s,
            expected,
          } = testCase;

          const subject = new SingleGroupMangleExpression({
            patternTemplate,
            caseSensitive,
          });

          const result = subject.replaceAll(s, replacements);
          expect(result).to.equal(expected);
        }
      });
    }
  });
});
