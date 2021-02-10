import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";
import * as path from "path";

import WebManglerCliFile from "../file.class";

type TestCase = {
  content: string;
  expectedSize: number;
  expectedType: string;
  filePath: string;
};

suite("WebManglerCliFile", function() {
  const replacementContentString = "not the original string";
  const replacementContentSize = 23;

  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "Sample",
      cases: [
        {
          content: "foobar",
          filePath: path.resolve(__dirname, "foo.bar"),
          expectedSize: 6,
          expectedType: "bar",
        },
        {
          content: "var hello = \"world!\";",
          filePath: path.resolve(__dirname, "hello-world.js"),
          expectedSize: 21,
          expectedType: "js",
        },
        {
          content: replacementContentString,
          filePath: path.resolve(__dirname, "test.css"),
          expectedSize: replacementContentSize,
          expectedType: "css",
        },
      ],
    },
  ];

  for (const { name, cases } of scenarios) {
    test(name, function() {
      for (const testCase of cases) {
        const {
          content,
          filePath,
          expectedSize,
          expectedType,
        } = testCase;

        const file = new WebManglerCliFile({ content, filePath });
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
