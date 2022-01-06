import { expect } from "chai";

import {
  sampleValues,
  selectorCombinators,
} from "../common";

import { patterns, QUOTES_ARRAY } from "../../common";

suite("JavaScript - common expressions", function() {
  suite("Patterns", function() {
    suite("::allowedAfterSelector", function() {
      const getRegExp = () => {
        return new RegExp(patterns.allowedAfterSelector, "gm");
      };

      test("allowed strings", function() {
        const testCases = [
          ...selectorCombinators,
          ".",
          "#",
          "[",
          ":",
          ")",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("disallowed strings", function() {
        const testCases = [
          "",
          "foobar",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(false, `in "${testCase}"`);
        }
      });
    });

    suite("::allowedBeforeSelector", function() {
      const getRegExp = () => {
        return new RegExp(patterns.allowedBeforeSelector, "gm");
      };

      test("allowed strings", function() {
        const testCases = [
          ...selectorCombinators,
          "(",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("disallowed strings", function() {
        const testCases = [
          "",
          "foobar",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(false, `in "${testCase}"`);
        }
      });
    });

    suite("::comment", function() {
      const getRegExp = () => {
        return new RegExp(patterns.comment, "gm");
      };

      test("inline comments", function() {
        const testCases = [
          ...sampleValues.inlineComments,
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("line comments", function() {
        const testCases = [
          ...sampleValues.lineComments,
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("no comments", function() {
        const testCases = [
          "",
          "var x = 42;",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(false, `in "${testCase}"`);
        }
      });
    });

    suite("::quotes", function() {
      const getRegExp = () => {
        return new RegExp(patterns.quotes, "gm");
      };

      test("string quotes", function() {
        const testCases = [
          "'",
          "\"",
          "`",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("no string quotes", function() {
        const testCases = [
          "",
          "var x = 42;",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(false, `in "${testCase}"`);
        }
      });
    });
  });

  suite("Values", function() {
    suite("::QUOTES_ARRAY", function() {
      test("contains double quotes", function() {
        const result = QUOTES_ARRAY.includes("\"");
        expect(result).to.be.true;
      });

      test("contains single quote", function() {
        const result = QUOTES_ARRAY.includes("'");
        expect(result).to.be.true;
      });

      test("contains backticks", function() {
        const result = QUOTES_ARRAY.includes("`");
        expect(result).to.be.true;
      });

      test("contains only the expected quotes", function() {
        expect(QUOTES_ARRAY).to.have.length(3);
      });
    });
  });
});
