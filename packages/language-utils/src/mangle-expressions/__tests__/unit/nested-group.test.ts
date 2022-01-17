import type { TestScenarios } from "@webmangler/testing";

import { expect } from "chai";

import NestedGroupMangleExpression from "../../nested-group.class";

suite("NestedGroupMangleExpression", function() {
  suite("::findAll", function() {
    type TestCase = Iterable<{
      patternTemplate: string;
      subPatternTemplate: string;
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
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "var pw = 'correct horse battery staple';",
            expected: ["horse", "battery"],
          },
          {
            patternTemplate: "(?<=class=\")(?<g>[^\"]*%s[^\"]*)(?=\")",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s)",
            group: "g",
            caseSensitive: true,
            pattern: "cls-[a-z]+",
            s: "<img class=\"cls-foo cls-bar\">",
            expected: ["cls-foo", "cls-bar"],
          },
          {
            patternTemplate: "(?<=\\<[a-z]+\\s)(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            caseSensitive: true,
            pattern: "data-[a-z]+",
            s: "<div data-foo=\"bar\" id=\"3\" data-bar></div>",
            expected: ["data-foo", "data-bar"],
          },
          {
            patternTemplate: "(\\/\\*.*?\\*\\/|(?<g>%s))",
            subPatternTemplate: "(?<g>%s)",
            group: "g",
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "/*foobaz*/foobar",
            expected: ["foobar"],
          },
        ],
      },
      {
        testName: "default case sensitivity",
        getScenario: () => [
          {
            patternTemplate: "(?<=\\<[a-z]+\\s)(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            pattern: "data-[a-z]+",
            s: "<div data-foo=\"bar\" id=\"3\" data-bar></div>",
            expected: ["data-foo", "data-bar"],
          },
          {
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            pattern: "[A-Za-z]+",
            s: "var pw = 'Correct Horse Battery Staple';",
            expected: ["Horse", "Battery"],
          },
        ],
      },
      {
        testName: "patterns with newlines",
        getScenario: () => [
          {
            patternTemplate: "(?<=')\n(?<g>[^']*%s[^']*)\n(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "var pw = 'correct horse battery staple';",
            expected: ["horse", "battery"],
          },
          {
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)\n(?<g>%s)\n(?=\\s)",
            group: "g",
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "var pw = 'correct horse battery staple';",
            expected: ["horse", "battery"],
          },
        ],
      },
      {
        testName: "case sensitive",
        getScenario: () => [
          {
            patternTemplate: "(?<=\\<[a-z]+\\s)(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            caseSensitive: true,
            pattern: "data-[A-Za-z]+",
            s: "<div data-foo=\"bar\" id=\"3\" data-BAR></div>",
            expected: ["data-foo", "data-BAR"],
          },
          {
            patternTemplate: "(?<=\\<[a-z]+\\s)(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            caseSensitive: true,
            pattern: "data-[A-Za-z]+",
            s: "<div data-Foo=\"bar\" id=\"3\" data-Bar></div>",
            expected: ["data-Foo", "data-Bar"],
          },
        ],
      },
      {
        testName: "case insensitive",
        getScenario: () => [
          {
            patternTemplate: "(?<=\\<[a-z]+\\s)(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            caseSensitive: false,
            pattern: "data-[a-z]+",
            s: "<div data-foo=\"bar\" id=\"3\" data-BAR></div>",
            expected: ["data-foo", "data-bar"],
          },
          {
            patternTemplate: "(?<=\\<[a-z]+\\s)(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            caseSensitive: false,
            pattern: "data-[a-z]+",
            s: "<div data-Foo=\"bar\" id=\"3\" data-Bar></div>",
            expected: ["data-foo", "data-bar"],
          },
        ],
      },
      {
        testName: "missing group",
        getScenario: () => [
          {
            patternTemplate: "(?<g1>foo%s)",
            subPatternTemplate: "(?<g2>%s)",
            group: "g1",
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "foobar",
            expected: [],
          },
          {
            patternTemplate: "(?<g1>hello%s)",
            subPatternTemplate: "(?<g2>%s)",
            group: "g2",
            caseSensitive: true,
            pattern: "\\s[a-z]+",
            s: "hello world",
            expected: [],
          },
        ],
      },
      {
        testName: "corner cases",
        getScenario: () => [
          {
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "",
            expected: [],
          },
          {
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "var m = new Map();",
            expected: [],
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const {
            patternTemplate,
            subPatternTemplate,
            group,
            caseSensitive,
            pattern,
            s,
            expected,
          } = testCase;

          const subject = new NestedGroupMangleExpression({
            patternTemplate,
            subPatternTemplate,
            groupName: group,
            caseSensitive,
          });

          let i = 0;
          for (const str of subject.findAll(s, pattern)) {
            expect(str).to.equal(expected[i]);
            i++;
          }

          expect(i).to.equal(expected.length, `in ${s}`);
        }
      });

      test(`${testName} (deprecated constructor)`, function() {
        for (const testCase of getScenario()) {
          const {
            patternTemplate,
            subPatternTemplate,
            group,
            caseSensitive,
            pattern,
            s,
            expected,
          } = testCase;

          const subject = new NestedGroupMangleExpression(
            patternTemplate,
            subPatternTemplate,
            group,
            caseSensitive,
          );

          let i = 0;
          for (const str of subject.findAll(s, pattern)) {
            expect(str).to.equal(expected[i]);
            i++;
          }

          expect(i).to.equal(expected.length, `in ${s}`);
        }
      });
    }
  });

  suite("::replaceAll", function() {
    type TestCase = Iterable<{
      patternTemplate: string;
      subPatternTemplate: string;
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
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            caseSensitive: true,
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
            caseSensitive: true,
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
            caseSensitive: true,
            replacements: new Map([
              ["data-foo", "data-a"],
              ["data-bar", "data-b"],
              ["data-foobar", "data-c"],
            ]),
            s: "<div data-foo=\"bar\" id=\"3\" data-bar></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-b></div>",
          },
          {
            patternTemplate: "(?<=\\<)[a-z]+\\s(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            caseSensitive: true,
            replacements: new Map([
              ["data-foo", "data-a"],
              ["data-bar", "data-b"],
            ]),
            s: "<div data-foo=\"bar\" data-bar=\"foo\"></div>",
            expected: "<div data-a=\"bar\" data-b=\"foo\"></div>",
          },
        ],
      },
      {
        testName: "case sensitive",
        getScenario: () => [
          {
            patternTemplate: "(?<=\\<[a-z]+\\s)(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            caseSensitive: true,
            replacements: new Map([
              ["data-FOO", "data-a"],
              ["data-bar", "data-b"],
            ]),
            s: "<div data-FOO=\"bar\" id=\"3\" data-bar></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-b></div>",
          },
          {
            patternTemplate: "(?<=\\<[a-z]+\\s)(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            caseSensitive: true,
            replacements: new Map([
              ["data-foo", "data-a"],
              ["data-BAR", "data-b"],
            ]),
            s: "<div data-foo=\"bar\" id=\"3\" data-BAR></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-b></div>",
          },
          {
            patternTemplate: "(?<=\\<[a-z]+\\s)(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            caseSensitive: true,
            replacements: new Map([
              ["data-FOO", "data-a"],
              ["data-BAR", "data-b"],
            ]),
            s: "<div data-FOO=\"bar\" id=\"3\" data-bar></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-bar></div>",
          },
        ],
      },
      {
        testName: "case insensitive",
        getScenario: () => [
          {
            patternTemplate: "(?<=\\<[a-z]+\\s)(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            caseSensitive: false,
            replacements: new Map([
              ["data-foo", "data-a"],
              ["data-bar", "data-b"],
            ]),
            s: "<div data-FOO=\"bar\" id=\"3\" data-bar></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-b></div>",
          },
          {
            patternTemplate: "(?<=\\<[a-z]+\\s)(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            caseSensitive: false,
            replacements: new Map([
              ["data-foo", "data-a"],
              ["data-bar", "data-b"],
            ]),
            s: "<div data-foo=\"bar\" id=\"3\" data-BAR></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-b></div>",
          },
          {
            patternTemplate: "(?<=\\<[a-z]+\\s)(?<g>[^>]*%s[^>]*)(?=\\>)",
            subPatternTemplate: "(?<=^|\\s)(?<g>%s)(?=$|\\s|\\=)",
            group: "g",
            caseSensitive: false,
            replacements: new Map([
              ["data-foo", "data-a"],
              ["data-bar", "data-b"],
            ]),
            s: "<div data-FOO=\"bar\" id=\"3\" data-bar></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-b></div>",
          },
        ],
      },
      {
        testName: "missing group",
        getScenario: () => [
          {
            patternTemplate: "(?<g1>foo%s)",
            subPatternTemplate: "(?<g2>%s)",
            group: "g1",
            caseSensitive: true,
            replacements: new Map([
              ["bar", "baz"],
            ]),
            s: "foobar",
            expected: "foobar",
          },
          {
            patternTemplate: "(?<g1>hello%s)",
            subPatternTemplate: "(?<g2>%s)",
            group: "g2",
            caseSensitive: true,
            replacements: new Map([
              [" world", " planet"],
            ]),
            s: "hello world",
            expected: "hello world",
          },
        ],
      },
      {
        testName: "corner cases",
        getScenario: () => [
          {
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            caseSensitive: true,
            replacements: new Map(),
            s: "",
            expected: "",
          },
          {
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)[a-z]+ (?<g>%s)(?=\\s)",
            group: "g",
            caseSensitive: true,
            replacements: new Map(),
            s: "var pw = 'correct horse battery staple';",
            expected: "var pw = 'correct horse battery staple';",
          },
          {
            patternTemplate: "(?<=')(?<g>[^']*%s[^']*)(?=')",
            subPatternTemplate: "(?<=\\s)(?<g>%s)(?=\\s)",
            group: "g",
            caseSensitive: true,
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
            caseSensitive: true,
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

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const {
            patternTemplate,
            subPatternTemplate,
            group,
            caseSensitive,
            replacements,
            s,
            expected,
          } = testCase;

          const subject = new NestedGroupMangleExpression({
            patternTemplate,
            subPatternTemplate,
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
            subPatternTemplate,
            group,
            caseSensitive,
            replacements,
            s,
            expected,
          } = testCase;

          const subject = new NestedGroupMangleExpression(
            patternTemplate,
            subPatternTemplate,
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
