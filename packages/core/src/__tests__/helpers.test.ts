import { expect } from "chai";

import {
  toArrayIfNeeded,
} from "../helpers";

suite("Helpers (core/src)", function() {
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
