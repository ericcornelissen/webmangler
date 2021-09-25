import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import {
  embedContentInContext,
} from "./benchmark-helpers";

type TestCase = {
  input: string;
}

suite("CSS Benchmark Helpers", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
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
    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const { input } = testCase;

          const result = embedContentInContext(input);
          expect(result).not.to.equal(input);
          expect(result).to.contain(input);
        }
      });
    }
  });
});
