import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import SingleGroupManglerExpression from "../single-group.class";

suite("SingleGroupManglerExpression", function() {
  suite("::exec", function() {
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

          const subject = new SingleGroupManglerExpression(
            patternTemplate,
            group,
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

          const subject = new SingleGroupManglerExpression(
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
