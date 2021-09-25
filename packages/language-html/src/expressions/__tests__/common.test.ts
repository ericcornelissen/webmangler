import { expect } from "chai";

import { sampleValues } from "./values";

import { patterns } from "../common";

suite("HTML - common expressions", function() {
  suite("Patterns", function() {
    suite("::afterAttribute", function() {
      const getRegExp = () => {
        return new RegExp(patterns.afterAttribute, "gm");
      };

      test("allowed strings", function() {
        const testCases = [
          ...sampleValues.whitespace.filter((s) => s.length > 0),
          "/",
          ">",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("disallowed strings", function() {
        const testCases = [
          "foobar",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(false, `in "${testCase}"`);
        }
      });
    });

    suite("::afterAttributeName", function() {
      const getRegExp = () => {
        return new RegExp(patterns.afterAttributeName, "gm");
      };

      test("allowed strings", function() {
        const testCases = [
          ...sampleValues.whitespace.filter((s) => s.length > 0),
          "=",
          "/",
          ">",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("disallowed strings", function() {
        const testCases = [
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

      test("single quoted string", function() {
        const testCases = [
          "''",
          "'foobar'",
          "'foo&#39;bar'",
          "'foo&quot;bar'",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("double quoted string", function() {
        const testCases = [
          "\"\"",
          "\"foobar\"",
          "\"foo&#39;bar\"",
          "\"foo&quot;bar\"",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("no string", function() {
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

    suite("::attributes", function() {
      const getRegExp = (): RegExp => {
        return new RegExp(patterns.attributes, "gm");
      };

      test("attributes", function() {
        const testCases = [
          ...sampleValues.attributes.map((s) => `<div ${s}></div>`),
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("no attributes", function() {
        const testCases = [
          "",
          " ",
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
          "<div></div>",
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

      test("quotes", function() {
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

      test("no quotes", function() {
        const testCases = [
          "",
          "`",
          "foobar",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(false, `in "${testCase}"`);
        }
      });
    });

    suite("::tagOpen", function() {
      const getRegExp = () => {
        return new RegExp(patterns.tagOpen, "gm");
      };

      test("tag openings", function() {
        const testCases = [
          "<div id=foobar></div>",
          "< span id=foobar></span>",
        ];

        for (const testCase of testCases) {
          const regExp = getRegExp();
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("no tag openings", function() {
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
  });
});
