import type { TestScenarios } from "@webmangler/testing";

import { expect } from "chai";

import SingleGroupMangleExpression from "../../single-group.class";

suite("SingleGroupMangleExpression", function() {
  suite("::findAll", function() {
    type TestCase = Iterable<{
      patternTemplate: string;
      group: string;
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
            patternTemplate: "(?<g>%s)",
            group: "g",
            caseSensitive: true,
            pattern: "\\-[a-z]+",
            s: "foo-bar",
            expected: ["-bar"],
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "foo-bar",
            expected: ["bar"],
          },
          {
            patternTemplate: "(?<g>%s)(?=\\-)",
            group: "g",
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
            patternTemplate: "(?<g>%s)(?=\\-)",
            group: "g",
            pattern: "[a-z]+",
            s: "foo-bar",
            expected: ["foo"],
          },
          {
            patternTemplate: "(?<g>%s)",
            group: "g",
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
            patternTemplate: "(?<=\\-)\n(?<g>%s)",
            group: "g",
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "foo-bar",
            expected: ["bar"],
          },
          {
            patternTemplate: "(?<g>%s)\n(?=\\-)",
            group: "g",
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
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            caseSensitive: true,
            pattern: "[A-Za-z]+",
            s: "foo-BAR",
            expected: ["BAR"],
          },
          {
            patternTemplate: "(?<g>%s)(?=\\-)",
            group: "g",
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
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            caseSensitive: false,
            pattern: "[a-z]+",
            s: "foo-BAR",
            expected: ["bar"],
          },
          {
            patternTemplate: "(?<g>%s)(?=\\-)",
            group: "g",
            caseSensitive: false,
            pattern: "[a-z]+",
            s: "Foo-bar",
            expected: ["foo"],
          },
        ],
      },
      {
        testName: "missing group",
        getScenario: () => [
          {
            patternTemplate: "(?<g>foo%s)",
            group: "f",
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
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "",
            expected: [],
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
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
            group,
            caseSensitive,
            pattern,
            s,
            expected,
          } = testCase;

          const subject = new SingleGroupMangleExpression({
            patternTemplate,
            groupName: group,
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

      test(`${testName} (deprecated constructor)`, function() {
        for (const testCase of getScenario()) {
          const {
            patternTemplate,
            group,
            caseSensitive,
            pattern,
            s,
            expected,
          } = testCase;

          const subject = new SingleGroupMangleExpression(
            patternTemplate,
            group,
            caseSensitive,
          );

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
      group: string;
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
            patternTemplate: "(?<g>%s)",
            group: "g",
            caseSensitive: true,
            replacements: new Map([
              ["bar", "baz"],
            ]),
            s: "foo-bar",
            expected: "foo-baz",
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            caseSensitive: true,
            replacements: new Map([
              ["foo", "oof"],
              ["bar", "baz"],
            ]),
            s: "foo-bar",
            expected: "foo-baz",
          },
          {
            patternTemplate: "(?<g>%s)(?=\\!)",
            group: "g",
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
            patternTemplate: "(?<g>%s)",
            group: "g",
            caseSensitive: true,
            replacements: new Map([
              ["BAR", "b"],
            ]),
            s: "foo-BAR",
            expected: "foo-b",
          },
          {
            patternTemplate: "(?<g>%s)(?=\\!)",
            group: "g",
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
            patternTemplate: "(?<g>%s)",
            group: "g",
            caseSensitive: false,
            replacements: new Map([
              ["bar", "baz"],
            ]),
            s: "foo-BAR",
            expected: "foo-baz",
          },
          {
            patternTemplate: "(?<g>%s)(?=\\!)",
            group: "g",
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
        testName: "missing group",
        getScenario: () => [
          {
            patternTemplate: "(?<g>%s)",
            group: "f",
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
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            caseSensitive: true,
            replacements: new Map(),
            s: "",
            expected: "",
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            caseSensitive: true,
            replacements: new Map(),
            s: "foo-bar",
            expected: "foo-bar",
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            caseSensitive: true,
            replacements: new Map([
              ["foo", "bar"],
            ]),
            s: "",
            expected: "",
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            caseSensitive: true,
            replacements: new Map([
              ["foo", "bar"],
            ]),
            s: "",
            expected: "",
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
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
            group,
            caseSensitive,
            replacements,
            s,
            expected,
          } = testCase;

          const subject = new SingleGroupMangleExpression({
            patternTemplate,
            groupName: group,
            caseSensitive,
          });

          const result = subject.replaceAll(s, replacements);
          expect(result).to.equal(expected);
        }
      });

      test(`${testName} (deprecated constructor)`, function() {
        for (const testCase of getScenario()) {
          const {
            patternTemplate,
            group,
            caseSensitive,
            replacements,
            s,
            expected,
          } = testCase;

          const subject = new SingleGroupMangleExpression(
            patternTemplate,
            group,
            caseSensitive,
          );

          const result = subject.replaceAll(s, replacements);
          expect(result).to.equal(expected);
        }
      });
    }
  });
});
