import type { TestScenarios } from "@webmangler/testing";

import { expect } from "chai";

import DefaultWebManglerCliFile from "../../file.class";

suite("DefaultWebManglerCliFile", function() {
  const replacementContentString = "not the original string";
  const replacementContentSize = 23;

  interface TestCase {
    readonly content: string;
    readonly expectedSize: number;
    readonly expectedType: string;
    readonly filePath: string;
  }

  const scenarios: TestScenarios<TestCase[]> = [
    {
      testName: "Sample",
      getScenario: () => [
        {
          content: "foobar",
          filePath: "foo.bar",
          expectedSize: 6,
          expectedType: "bar",
        },
        {
          content: "var hello = \"world!\";",
          filePath: "/path/to/hello-world.js",
          expectedSize: 21,
          expectedType: "js",
        },
        {
          content: replacementContentString,
          filePath: "/workspace/test.css",
          expectedSize: replacementContentSize,
          expectedType: "css",
        },
      ],
    },
  ];

  for (const { getScenario, testName } of scenarios) {
    test(testName, function() {
      for (const testCase of getScenario()) {
        const {
          content,
          filePath,
          expectedSize,
          expectedType,
        } = testCase;

        const file = new DefaultWebManglerCliFile({ content, filePath });
        expect(file.content).to.equal(content);
        expect(file.path).to.equal(filePath);
        expect(file.type).to.equal(expectedType);
        expect(file.size).to.equal(expectedSize);
        expect(file.originalSize).to.equal(expectedSize);

        file.content = replacementContentString;
        expect(file.size).to.equal(replacementContentSize);
        expect(file.originalSize).to.equal(expectedSize);
      }
    });
  }
});
