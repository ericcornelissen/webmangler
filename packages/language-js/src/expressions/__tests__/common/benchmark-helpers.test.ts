import type { TestScenarios } from "@webmangler/testing";

import { expect } from "chai";

import {
  embedContentInContext,
} from "./benchmark-helpers";

suite("JavaScript Benchmark Helpers", function() {
  interface TestCase {
    readonly input: string;
  }

  const scenarios: TestScenarios<Iterable<TestCase>> = [
    {
      testName: "sample",
      getScenario: () => [
        {
          input: "var foo = \"bar\";",
        },
        {
          input: "function hello() { return \"world!\"; }",
        },
        {
          input: `
            var foo = "bar";
            function hello() { return "world!"; }
          `,
        },
      ],
    },
  ];

  suite("::embedContentInContext", function() {
    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const { input } = testCase;

          const result = embedContentInContext(input);
          expect(result).not.to.equal(input);
          expect(result).to.contain(input);
        }
      });
    }
  });
});
