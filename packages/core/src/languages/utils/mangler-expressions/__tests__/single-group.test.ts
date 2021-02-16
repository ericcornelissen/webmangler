import type { TestScenario } from "@webmangler/testing";

import { expect, use as chaiUse } from "chai";
import * as sinonChai from "sinon-chai";

import SingleGroupManglerExpression from "../single-group.class";

chaiUse(sinonChai);

suite("SingleGroupManglerExpression", function() {
  suite("::exec", function() {
    type TestCase = {
      patternTemplate: string;
      group: string;
      s: string;
      pattern: string;
      expected: string[];
    };

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "sample",
        cases: [
          {
            patternTemplate: "(?<g>%s)",
            group: "g",
            s: "foo-bar",
            pattern: "\\-[a-z]+",
            expected: ["-bar"],
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            s: "foo-bar",
            pattern: "[a-z]+",
            expected: ["bar"],
          },
          {
            patternTemplate: "(?<g>%s)(?=\\-)",
            group: "g",
            s: "foo-bar",
            pattern: "[a-z]+",
            expected: ["foo"],
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const { patternTemplate, group, s, pattern, expected } = testCase;

          const subject = new SingleGroupManglerExpression(patternTemplate, group);

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
      s: string;
      replacements: Map<string, string>;
      expected: string;
    };

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "sample",
        cases: [
          {
            patternTemplate: "(?<g>%s)",
            group: "g",
            s: "foo-bar",
            replacements: new Map([["bar", "baz"]]),
            expected: "foo-baz",
          },
          {
            patternTemplate: "(?<=\\-)(?<g>%s)",
            group: "g",
            s: "foo-bar",
            replacements: new Map([
              ["foo", "oof"],
              ["bar", "baz"],
            ]),
            expected: "foo-baz",
          },
          {
            patternTemplate: "(?<g>%s)(?=\\!)",
            group: "g",
            s: "Hello world! Hey planet!",
            replacements: new Map([
              ["world", "mundo"],
              ["planet", "planeta"],
            ]),
            expected: "Hello mundo! Hey planeta!",
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const { patternTemplate, group, s, replacements, expected } = testCase;

          const subject = new SingleGroupManglerExpression(patternTemplate, group);
          const result = subject.replaceAll(s, replacements);
          expect(result).to.equal(expected);
        }
      });
    }
  });

  test("deprecated replace method", function() {
    const subject = new SingleGroupManglerExpression("(?<g>%s)", "g");
    expect(subject.replace).to.throw();
  });
});
