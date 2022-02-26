import { expect } from "chai";

import { sampleValues } from "../common";

import {
  patterns,
  QUOTES_ARRAY,
  QUOTED_ATTRIBUTE_PATTERN,
} from "../../common";

suite("HTML - common expressions", function() {
  suite("Functions", function() {
    suite("::QUOTED_ATTRIBUTE_PATTERN", function() {
      test("return value includes the attribute pattern", function() {
        const attributePattern = "foobar";

        const result = QUOTED_ATTRIBUTE_PATTERN(attributePattern, "");
        expect(result).to.include(attributePattern);
      });

      test("return value includes the quote pattern", function() {
        const quotePattern = "(?:\"|')";

        const result = QUOTED_ATTRIBUTE_PATTERN("", quotePattern);
        expect(result).to.include(quotePattern);
      });

      test("allowed strings", function() {
        const pattern = QUOTED_ATTRIBUTE_PATTERN("foo", "(?:\"|')");

        const testCases = [
          "foo=\"bar\"",
          "foo =\"bar\"",
          "foo= \"bar\"",
          "foo = \"bar\"",
          "foo=\" bar\"",
          "foo =\" bar\"",
          "foo= \" bar\"",
          "foo = \" bar\"",
          "foo='bar'",
          "foo ='bar'",
          "foo= 'bar'",
          "foo = 'bar'",
          "foo=' bar'",
          "foo =' bar'",
          "foo= ' bar'",
          "foo = ' bar'",
        ];

        for (const testCase of testCases) {
          const regExp = new RegExp(pattern, "gm");
          const result = regExp.test(testCase);
          expect(result).to.equal(true, `in "${testCase}"`);
        }
      });

      test("disallowed strings", function() {
        const pattern = QUOTED_ATTRIBUTE_PATTERN("foo", "(?:\"|')");

        const testCases = [
          "foobar",
          "foo bar",
          "foo=bar",
          "bar=\"foo\"",
          "bar='foo'",
        ];

        for (const testCase of testCases) {
          const regExp = new RegExp(pattern, "gm");
          const result = regExp.test(testCase);
          expect(result).to.equal(false, `in "${testCase}"`);
        }
      });
    });
  });

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

      test("contains only the expected quotes", function() {
        expect(QUOTES_ARRAY).to.have.length(2);
      });
    });
  });
});
