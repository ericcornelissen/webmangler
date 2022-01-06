import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import {
  embedContentInContext,
} from "./benchmark-helpers";

type TestCase = {
  input: string;
}

suite("JavaScript Benchmark Helpers", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
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
