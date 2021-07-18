import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import {
  embedContentInBody,
  embedContentInContext,
} from "./benchmark-helpers";

type TestCase = {
  input: string;
}

suite("HTML Benchmark Helpers", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "<div class=\"hello world\"></div>",
        },
        {
          input: "<div data-foo=\"bar\"></div>",
        },
        {
          input: `
            <div>
              <p>Lorem ipsum dolor</p>
            </div>
          `,
        },
      ],
    },
  ];

  suite("::embedContentInBody", function() {
    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const { input } = testCase;

          const result = embedContentInBody(input);
          expect(result).to.contain(input);
        }
      });
    }
  });

  suite("::embedContentInContext", function() {
    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const { input } = testCase;

          const result = embedContentInContext(input);
          expect(result).to.contain(input);
        }
      });
    }
  });
});
