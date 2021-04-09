import type { TestScenario } from "@webmangler/testing";

import type { TestCase } from "./types";

import { expect } from "chai";

import {
  embedAttributeValue,
  embedAttributesInAdjacentTags,
  embedAttributesInNestedTags,
  embedAttributesInTags,
  withOtherAttributes,
} from "./html-helpers";

suite("HTML Test Helpers", function() {
  suite("::embedAttributeValue", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "changing values",
        cases: [
          {
            input: "color: red;",
            expected: "color: blue;",
          },
          {
            input: "font: serif",
            expected: "font: sans-serif",
          },
          {
            input: "content: attr(data-foo);",
            expected: "content: attr(data-bar);",
          },
          {
            input: "--foo: 42;",
            expected: "--bar: 42;",
          },
        ],
      },
      {
        name: "unchanging values",
        cases: [
          {
            input: "color: red;",
            expected: "color: red;",
          },
          {
            input: "font: serif",
            expected: "font: serif",
          },
          {
            input: "content: attr(data-foobar);",
            expected: "content: attr(data-foobar);",
          },
          {
            input: "--foobar: 42;",
            expected: "--foobar: 42;",
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const attr = "style";
          const result = embedAttributeValue(attr, testCase);
          expect(result.input).to.equal(`${attr}="${testCase.input}"`);
          expect(result.expected).to.include(`${attr}="${testCase.expected}"`);
        }
      });
    }
  });

  suite("::embedAttributesInAdjacentTags", function() {
    const scenarios: TestScenario<[TestCase, TestCase]>[] = [
      {
        name: "changing attributes",
        cases: [
          [
            {
              input: "class=\"foo\"",
              expected: "class=\"bar\"",
            },
            {
              input: "id=\"foo\"",
              expected: "id=\"bar\"",
            },
          ],
          [
            {
              input: "data-foo=\"bar\"",
              expected: "data-foo=\"baz\"",
            },
            {
              input: "data-bar=\"foo\"",
              expected: "data-baz=\"foo\"",
            },
          ],
          [
            {
              input: "height=\"36\" width=\"42\"",
              expected: "height=\"42\" width=\"36\"",
            },
            {
              input: "width=\"36\" height=\"42\"",
              expected: "width=\"42\" height=\"36\"",
            },
          ],
        ],
      },
      {
        name: "unchanging attributes",
        cases: [
          [
            {
              input: "class=\"foo\"",
              expected: "class=\"foo\"",
            },
            {
              input: "id=\"bar\"",
              expected: "id=\"bar\"",
            },
          ],
          [
            {
              input: "height=\"36\" ",
              expected: "height=\"36\"",
            },
            {
              input: "width=\"42\"",
              expected: "width=\"42\"",
            },
          ],
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const [testCaseA, testCaseB] of cases) {
          const results = embedAttributesInAdjacentTags([testCaseA, testCaseB]);
          expect(results).to.have.length.above(1);
          for (const result of results) {
            expect(result.input).to.include(testCaseA.input);
            expect(result.input).to.include(testCaseB.input);
            expect(result.expected).to.include(testCaseA.expected);
            expect(result.expected).to.include(testCaseB.expected);
          }
        }
      });
    }
  });

  suite("::embedAttributesInNestedTags", function() {
    const scenarios: TestScenario<[TestCase, TestCase]>[] = [
      {
        name: "changing attributes",
        cases: [
          [
            {
              input: "class=\"foo\"",
              expected: "class=\"bar\"",
            },
            {
              input: "id=\"foo\"",
              expected: "id=\"bar\"",
            },
          ],
          [
            {
              input: "data-foo=\"bar\"",
              expected: "data-foo=\"baz\"",
            },
            {
              input: "data-bar=\"foo\"",
              expected: "data-baz=\"foo\"",
            },
          ],
          [
            {
              input: "height=\"36\" width=\"42\"",
              expected: "height=\"42\" width=\"36\"",
            },
            {
              input: "width=\"36\" height=\"42\"",
              expected: "width=\"42\" height=\"36\"",
            },
          ],
        ],
      },
      {
        name: "unchanging attributes",
        cases: [
          [
            {
              input: "class=\"foo\"",
              expected: "class=\"foo\"",
            },
            {
              input: "id=\"bar\"",
              expected: "id=\"bar\"",
            },
          ],
          [
            {
              input: "height=\"36\" ",
              expected: "height=\"36\"",
            },
            {
              input: "width=\"42\"",
              expected: "width=\"42\"",
            },
          ],
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const [testCaseA, testCaseB] of cases) {
          const results = embedAttributesInNestedTags([testCaseA, testCaseB]);
          expect(results).to.have.length.above(1);
          for (const result of results) {
            expect(result.input).to.include(testCaseA.input);
            expect(result.input).to.include(testCaseB.input);
            expect(result.expected).to.include(testCaseA.expected);
            expect(result.expected).to.include(testCaseB.expected);
          }
        }
      });
    }
  });

  suite("::embedAttributesInTags", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "changing attributes",
        cases: [
          {
            input: "class=\"foo\"",
            expected: "class=\"bar\"",
          },
          {
            input: "data-bar=\"foo\"",
            expected: "data-baz=\"foo\"",
          },
          {
            input: "height=\"36\" width=\"42\"",
            expected: "height=\"42\" width=\"36\"",
          },
        ],
      },
      {
        name: "unchanging attributes",
        cases: [
          {
            input: "id=\"foobar\"",
            expected: "id=\"foobar\"",
          },
          {
            input: "height=\"36\" width=\"42\"",
            expected: "height=\"36\" width=\"42\"",
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const results = embedAttributesInTags(testCase);
          expect(results).to.have.length.above(1);
          for (const result of results) {
            expect(result.input).to.include(testCase.input);
            expect(result.expected).to.include(testCase.expected);
          }
        }
      });
    }

    test("standard tags", function() {
      const testCase: TestCase = {
        input: "id=\"foo\"",
        expected: "id=\"bar\"",
      };

      const results = embedAttributesInTags(testCase);
      const containsStandardTagTestCase = results.some((result) => {
        return /^<[a-z]+[^/>]+>/.test(result.input);
      });
      expect(containsStandardTagTestCase).to.be.true;
    });

    test("self-closing (tag)", function() {
      const testCase: TestCase = {
        input: "id=\"foo\"",
        expected: "id=\"bar\"",
      };

      const results = embedAttributesInTags(testCase);
      const containsSelfClosingTagTestCase = results.some((result) => {
        return /^<[a-z]+[^/>]+\/>/.test(result.input);
      });
      expect(containsSelfClosingTagTestCase).to.be.true;
    });
  });

  suite("::withOtherAttributes", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "unchanging attributes",
        cases: [
          {
            input: "id=\"foobar\"",
            expected: "id=\"foobar\"",
          },
          {
            input: "data-foo=\"bar\"",
            expected: "data-foo=\"bar\"",
          },
        ],
      },
      {
        name: "changing attributes",
        cases: [
          {
            input: "class=\"foo\"",
            expected: "class=\"bar\"",
          },
          {
            input: "data-foo=\"bar\"",
            expected: "data-foo=\"baz\"",
          },
          {
            input: "data-hello=\"world\"",
            expected: "data-hey=\"world\"",
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const results = withOtherAttributes(testCase);
          expect(results).to.have.length.above(1);
          for (const result of results) {
            expect(result.input).to.include(testCase.input);
            expect(result.expected).to.include(testCase.expected);
          }
        }
      });
    }
  });
});
