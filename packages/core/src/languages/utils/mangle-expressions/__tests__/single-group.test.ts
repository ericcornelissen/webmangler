import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import SingleGroupMangleExpression from "../single-group.class";

suite("SingleGroupMangleExpression", function() {
  suite("::exec", function() {
    type TestCase = {
      patternTemplate: string;
      group: string;
      ignoreStrings?: boolean;
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
        name: "ignore strings",
        cases: [
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            ignoreStrings: true,
            pattern: "[a-z]+",
            s: "\"-hello\" -world",
            expected: ["world"],
          },
          {
            patternTemplate: "(?<=\\#)(?<g>%s)",
            group: "g",
            ignoreStrings: true,
            pattern: "[a-z]+",
            s: "#foo '#bar'",
            expected: ["foo"],
          },
          {
            patternTemplate: "(?<=\\.)(?<g>%s)",
            group: "g",
            ignoreStrings: true,
            pattern: "[a-z]+",
            s: ".praise `.the` .sun",
            expected: ["praise", "sun"],
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
            ignoreStrings,
            pattern,
            s,
            expected,
          } = testCase;

          const subject = new SingleGroupMangleExpression(
            patternTemplate,
            group,
            ignoreStrings,
          );

          let i = 0;
          for (const str of subject.exec(s, pattern)) {
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
      ignoreStrings?: true,
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
        name: "ignore strings",
        cases: [
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            ignoreStrings: true,
            replacements: new Map([
              ["hello", "hey"],
              ["world", "planet"],
            ]),
            s: "\"-hello\" -world",
            expected: "\"-hello\" -planet",
          },
          {
            patternTemplate: "(?<=\\#)(?<g>%s)",
            group: "g",
            ignoreStrings: true,
            replacements: new Map([
              ["foo", "oof"],
              ["bar", "baz"],
            ]),
            s: "#foo '#bar'",
            expected: "#oof '#bar'",
          },
          {
            patternTemplate: "(?<=\\.)(?<g>%s)",
            group: "g",
            ignoreStrings: true,
            replacements: new Map([
              ["praise", "fear"],
              ["the", "a"],
              ["sun", "moon"],
            ]),
            s: ".praise `.the` .sun",
            expected: ".fear `.the` .moon",
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
            ignoreStrings,
            replacements,
            s,
            expected,
          } = testCase;

          const subject = new SingleGroupMangleExpression(
            patternTemplate,
            group,
            ignoreStrings,
          );

          const result = subject.replaceAll(s, replacements);
          expect(result).to.equal(expected);
        }
      });
    }
  });
});
