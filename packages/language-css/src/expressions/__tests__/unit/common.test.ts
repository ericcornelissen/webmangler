import { expect } from "chai";

import {
  attributeSelectorOperators,
  sampleValues,
  selectorCombinators,
} from "../common/values";

import { patterns } from "../../common";

suite("CSS - common expressions", function() {
  suite("Patterns", function() {
    const singleQuotedStringCases = [
      "''",
      "'foobar'",
      "'foo\\'bar'",
      "'foo\"bar'",
    ];
    const doubleQuotedStringCases = [
      "\"\"",
      "\"foobar\"",
      "\"foo'bar\"",
      "\"foo\\\"bar\"",
    ];

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

    suite("::arithmeticOperators", function() {
      const getRegExp = () => {
        return new RegExp(patterns.arithmeticOperators, "gm");
      };

      test("valid operators", function() {
        const testCases = [
          "+",
          "-",
          "*",
          "/",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("not valid operators", function() {
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

    suite("::attributeOperators", function() {
      const getRegExp = () => {
        return new RegExp(patterns.attributeOperators, "gm");
      };

      test("valid operators", function() {
        const testCases = [
          ...attributeSelectorOperators,
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("not valid operators", function() {
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

    suite("::anyString", function() {
      const getRegExp = () => {
        return new RegExp(patterns.anyString, "gm");
      };

      test("single quoted strings", function() {
        for (const testCase of singleQuotedStringCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("double quoted strings", function() {
        for (const testCase of doubleQuotedStringCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("no strings", function() {
        const testCases = [
          "",
          "foobar",
          "`foobar`",
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

      test("comments", function() {
        const testCases = [
          ...sampleValues.comments,
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
          ".foobar{}",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(false, `in "${testCase}"`);
        }
      });
    });

    suite("::commentClose", function() {
      const getRegExp = () => {
        return new RegExp(patterns.commentClose, "gm");
      };

      test("comments", function() {
        const testCases = [
          ...sampleValues.comments,
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
          ".foobar{}",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(false, `in "${testCase}"`);
        }
      });
    });

    suite("::commentOpen", function() {
      const getRegExp = () => {
        return new RegExp(patterns.commentOpen, "gm");
      };

      test("comments", function() {
        const testCases = [
          ...sampleValues.comments,
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
          ".foobar{}",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(false, `in "${testCase}"`);
        }
      });
    });

    suite("::declarationBlock", function() {
      const getRegExp = () => {
        return new RegExp(patterns.declarationBlock, "gm");
      };

      test("declaration blocks", function() {
        const testCases = [
          "{}",
          "{color:red;}",
          "{color:red;font:serif;}",
          "{/* foobar */}",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("no declaration block", function() {
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

    suite("::doubleQuotedString", function() {
      const getRegExp = () => {
        return new RegExp(patterns.doubleQuotedString, "gm");
      };

      test("double quoted strings", function() {
        for (const testCase of doubleQuotedStringCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("no double quoted strings", function() {
        const testCases = [
          "",
          "foobar",
          "`foobar`",
          ...singleQuotedStringCases,
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
          ".foobar{}",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(false, `in "${testCase}"`);
        }
      });
    });

    suite("::singleQuotedString", function() {
      const getRegExp = () => {
        return new RegExp(patterns.singleQuotedString, "gm");
      };

      test("single quoted strings", function() {
        for (const testCase of singleQuotedStringCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("no single quoted strings", function() {
        const testCases = [
          "",
          "foobar",
          "`foobar`",
          ...doubleQuotedStringCases,
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(false, `in "${testCase}"`);
        }
      });
    });
  });
});
