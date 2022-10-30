import type { TestScenarios } from "@webmangler/testing";

import { expect } from "chai";

import {
  embedContentInContext,
} from "./benchmark-helpers";

interface TestCase {
  readonly input: string;
}

suite("CSS Benchmark Helpers", function() {
  const scenarios: TestScenarios<Iterable<TestCase>> = [
    {
      testName: "sample",
      getScenario: () => [
        {
          input: ".foo { color: red; }",
        },
        {
          input: ".bar { background: blue; }",
        },
        {
          input: `
            div { padding: 4px 2px; }
            .container { margin: 3px 6px }
            #foo { content: "bar"; }
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
