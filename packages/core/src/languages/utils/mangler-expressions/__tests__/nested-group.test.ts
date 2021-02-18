import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import NestedGroupExpression from "../nested-group.class";

suite("NestedGroupExpression", function() {
  suite("::exec", function() {
    type TestCase = {
      patternTemplate: string;
      subPatternTemplate: string;
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
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            pattern: "[a-z]+",
            s: "var pw = 'correct horse battery staple';",
            expected: ["horse", "battery"],
          },
          {
            patternTemplate: "(?<=class=\")(?<g>[^\"]*%s[^\"]*)(?=\")",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s)",
            group: "g",
            pattern: "cls-[a-z]+",
            s: "<img class=\"cls-foo cls-bar\">",
            expected: ["cls-foo", "cls-bar"],
          },
          {
            patternTemplate: "(?<=\\<[a-z]+\\s)(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            pattern: "data-[a-z]+",
            s: "<div data-foo=\"bar\" id=\"3\" data-bar></div>",
            expected: ["data-foo", "data-bar"],
          },
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            pattern: "[a-z]+",
            s: "",
            expected: [],
          },
          {
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
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
            subPatternTemplate,
            group,
            pattern,
            s,
            expected,
          } = testCase;

          const subject = new NestedGroupExpression(
            patternTemplate,
            subPatternTemplate,
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
      subPatternTemplate: string;
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
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            replacements: new Map([
              ["horse", "zebra"],
              ["battery", "cell"],
            ]),
            s: "var pw = 'correct horse battery staple';",
            expected: "var pw = 'correct zebra cell staple';",
          },
          {
            patternTemplate: "(?<=class=\")(?<g>[^\"]*%s[^\"]*)(?=\")",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s)",
            group: "g",
            replacements: new Map([
              ["cls-foo", "a"],
              ["cls-foobar", "b"],
              ["cls-bar", "c"],
            ]),
            s: "<img class=\"cls-foo cls-bar\">",
            expected: "<img class=\"a c\">",
          },
          {
            patternTemplate: "(?<=\\<[a-z]+\\s)(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            replacements: new Map([
              ["data-foo", "data-a"],
              ["data-bar", "data-b"],
              ["data-foobar", "data-c"],
            ]),
            s: "<div data-foo=\"bar\" id=\"3\" data-bar></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-b></div>",
          },
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            replacements: new Map(),
            s: "",
            expected: "",
          },
          {
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            replacements: new Map(),
            s: "var pw = 'correct horse battery staple';",
            expected: "var pw = 'correct horse battery staple';",
          },
          {
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            replacements: new Map([
              ["foo", "bar"],
            ]),
            s: "",
            expected: "",
          },
          {
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            replacements: new Map([
              ["foo", "bar"],
            ]),
            s: "",
            expected: "",
          },
          {
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
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
            subPatternTemplate,
            group,
            replacements,
            s,
            expected,
          } = testCase;

          const subject = new NestedGroupExpression(
            patternTemplate,
            subPatternTemplate,
            group,
          );
          const result = subject.replaceAll(s, replacements);
          expect(result).to.equal(expected);
        }
      });
    }
  });
});
