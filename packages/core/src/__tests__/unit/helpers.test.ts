import { expect } from "chai";

import {
  getTypeFromFilePath,
  toArrayIfNeeded,
} from "../../helpers";

suite("Helpers (core/src)", function() {
  suite("::getTypeFromFilePath", function() {
    test("file path with extension", function() {
      interface TestCase {
        readonly input: string;
        readonly expected: string;
      }

      const testCases: TestCase[] = [
        { input: "/foo/bar.js", expected: "js" },
        { input: "/hello/world.html", expected: "html" },
        { input: "/praise/the/sun.css", expected: "css" },
      ];

      for (const testCase of testCases) {
        const { input, expected } = testCase;
        const result = getTypeFromFilePath(input);
        expect(result).to.equal(expected);
      }
    });

    test("file path without extension", function() {
      const testCases: string[] = [
        "/foobar",
        "/hello/world",
        "/praise/the/sun",
      ];

      for (const testCase of testCases) {
        const result = getTypeFromFilePath(testCase);
        expect(result).to.deep.equal("");
      }
    });
  });

  suite("::toArrayIfNeeded", function() {
    test("input is *not* an array", function() {
      const testCases: unknown[] = [
        2,
        "foobar",
        "Hello world!",
      ];

      for (const testCase of testCases) {
        const result = toArrayIfNeeded(testCase);
        expect(result).to.have.lengthOf(1);
        expect(result).to.deep.equal([testCase]);
      }
    });

    test("input is an array", function() {
      const testCases: unknown[][] = [
        [2],
        ["foobar"],
        ["foo", "bar"],
      ];

      for (const testCase of testCases) {
        const result = toArrayIfNeeded(testCase);
        expect(result).to.have.lengthOf(testCase.length);
        expect(result).to.deep.equal(testCase);
      }
    });
  });
});
