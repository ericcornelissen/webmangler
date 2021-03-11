import { expect } from "chai";

import {
  duplicates,
  toArrayIfNeeded,
} from "../helpers";

suite("Helpers (core/src)", function() {
  suite("::duplicates", function() {
    test("no duplicates", function() {
      const testCases: unknown[][] = [
        [],
        [1.61803, 2.718, 3.14],
        ["foo", "bar"],
      ];

      for (const testCase of testCases) {
        const result = testCase.filter(duplicates);
        expect(result).to.deep.equal(testCase);
      }
    });

    test("one duplicate", function() {
      const testCases: { array: unknown[], expected: unknown[] }[] = [
        {
          array: ["foo", "bar", "foo", "baz"],
          expected: ["foo", "bar", "baz"],
        },
        {
          array: ["foo", "foo", "bar"],
          expected: ["foo", "bar"],
        },
        {
          array: [1.61803, 2.718, 3.14, 3.14],
          expected: [1.61803, 2.718, 3.14],
        },
        {
          array: [1.61803, 2.718, 3.14, 2.718],
          expected: [1.61803, 2.718, 3.14],
        },
      ];

      for (const { array, expected } of testCases) {
        const result = array.filter(duplicates);
        expect(result).to.deep.equal(expected);
      }
    });

    test("two or more duplicate", function() {
      const testCases: { array: unknown[], expected: unknown[] }[] = [
        {
          array: ["foo", "bar", "foo", "baz", "foo"],
          expected: ["foo", "bar", "baz"],
        },
        {
          array: ["foo", "bar", "foo", "baz", "foo", "bar"],
          expected: ["foo", "bar", "baz"],
        },
        {
          array: [1.61803, 2.718, 3.14, 2.718, 1.61803],
          expected: [1.61803, 2.718, 3.14],
        },
      ];

      for (const { array, expected } of testCases) {
        const result = array.filter(duplicates);
        expect(result).to.deep.equal(expected);
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
