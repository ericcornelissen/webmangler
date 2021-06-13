import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import SingleGroupMangleExpression from "../single-group.class";

suite("SingleGroupMangleExpression", function() {
  suite("::findAll", function() {
    type TestCase = {
      patternTemplate: string;
      group: string;
      pattern: string;
      s: string;
      expected: string[];
    };

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "sample",
        cases: [
          {
            patternTemplate: "(?<g>%s)",
            group: "g",
            pattern: "\\-[a-z]+",
            s: "foo-bar",
            expected: ["-bar"],
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            pattern: "[a-z]+",
            s: "foo-bar",
            expected: ["bar"],
          },
          {
            patternTemplate: "(?<g>%s)(?=\\-)",
            group: "g",
            pattern: "[a-z]+",
            s: "foo-bar",
            expected: ["foo"],
          },
        ],
      },
      {
        name: "missing group",
        cases: [
          {
            patternTemplate: "(?<g>foo%s)",
            group: "f",
            pattern: "[a-z]+",
            s: "foobar",
            expected: [],
          },
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            pattern: "[a-z]+",
            s: "",
            expected: [],
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            pattern: "[a-z]+",
            s: "var m = new Map();",
            expected: [],
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            patternTemplate,
            group,
            pattern,
            s,
            expected,
          } = testCase;

          const subject = new SingleGroupMangleExpression(
            patternTemplate,
            group,
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
    type TestCase = {
      patternTemplate: string;
      group: string;
      replacements: Map<string, string>;
      s: string;
      expected: string;
    };

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "sample",
        cases: [
          {
            patternTemplate: "(?<g>%s)",
            group: "g",
            replacements: new Map([
              ["bar", "baz"],
            ]),
            s: "foo-bar",
            expected: "foo-baz",
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
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
        name: "missing group",
        cases: [
          {
            patternTemplate: "(?<g>%s)",
            group: "f",
            replacements: new Map([
              ["foobar", "foobaz"],
            ]),
            s: "foobar",
            expected: "foobar",
          },
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            replacements: new Map(),
            s: "",
            expected: "",
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            replacements: new Map(),
            s: "foo-bar",
            expected: "foo-bar",
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            replacements: new Map([
              ["foo", "bar"],
            ]),
            s: "",
            expected: "",
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            replacements: new Map([
              ["foo", "bar"],
            ]),
            s: "",
            expected: "",
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            replacements: new Map([
              ["foo", "bar"],
            ]),
            s: "var m = new Map();",
            expected: "var m = new Map();",
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            patternTemplate,
            group,
            replacements,
            s,
            expected,
          } = testCase;

          const subject = new SingleGroupMangleExpression(
            patternTemplate,
            group,
          );

          const result = subject.replaceAll(s, replacements);
          expect(result).to.equal(expected);
        }
      });
    }
  });
});
