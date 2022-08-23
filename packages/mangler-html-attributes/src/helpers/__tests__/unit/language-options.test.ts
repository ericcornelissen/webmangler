import { expect } from "chai";

import {
  getAttributeExpressionOptions,
  getAttributeSelectorExpressionOptions,
  getAttributeUsageExpressionFactory,
} from "../../language-options";

suite("Html Attribute Mangler prefix helpers", function() {
  suite("::getAttributeExpressionOptions", function() {
    const optionName = "attributes";

    test("the name", function() {
      const result = getAttributeExpressionOptions();
      expect(result.name).to.equal(optionName);
    });
  });

  suite("::getAttributeSelectorExpressionOptions", function() {
    const optionName = "query-selectors";

    const attributeSelectors: string[] = [
      "[data-foobar]",
      "[data-foo=\"bar\"]",
    ];
    const notAttributeSelectors: string[] = [
      ".foobar",
      "#foobar",
      "div",
    ];

    test("the name", function() {
      const result = getAttributeSelectorExpressionOptions();
      expect(result.name).to.equal(optionName);
    });

    suite("The `prefix` option", function() {
      let prefix: string;

      setup(function() {
        const result = getAttributeSelectorExpressionOptions();
        prefix = result.options.prefix as string;
      });

      test("is defined", function() {
        expect(prefix).not.to.be.undefined;
      });

      test("is a valid regular expression", function() {
        expect(() => new RegExp(prefix)).not.to.throw();
      });

      test("match attribute query selectors", function() {
        for (const testCase of attributeSelectors) {
          const regExp = new RegExp(prefix);
          expect(regExp.test(testCase)).to.equal(true, testCase);
        }
      });

      test("don't match non-attribute query selectors", function() {
        for (const testCase of notAttributeSelectors) {
          const regExp = new RegExp(prefix);
          expect(regExp.test(testCase)).to.equal(false, testCase);
        }
      });
    });

    suite("The `suffix` option", function() {
      let suffix: string;

      setup(function() {
        const result = getAttributeSelectorExpressionOptions();
        suffix = result.options.suffix as string;
      });

      test("is defined", function() {
        expect(suffix).not.to.be.undefined;
      });

      test("is a valid regular expression", function() {
        expect(() => new RegExp(suffix)).not.to.throw();
      });

      test("match attribute query selectors", function() {
        for (const testCase of attributeSelectors) {
          const regExp = new RegExp(suffix);
          expect(regExp.test(testCase)).to.equal(true, testCase);
        }
      });

      test("don't match non-attribute query selectors", function() {
        for (const testCase of notAttributeSelectors) {
          const regExp = new RegExp(suffix);
          expect(regExp.test(testCase)).to.equal(false, testCase);
        }
      });
    });
  });

  suite("::getAttributeUsageExpressionFactory", function() {
    const optionName = "css-declaration-values";

    const attributeUsage: string[] = [
      "attr(data-foobar)",
      "attr(data-foobar px)",
      "attr(data-foobar, 42)",
      "attr(data-foobar px, 42)",
      "ATTR(data-foobar)",
      "ATTr(data-foobar)",
      "ATtR(data-foobar)",
      "AtTR(data-foobar)",
      "ATtr(data-foobar)",
      "AtTr(data-foobar)",
      "AttR(data-foobar)",
      "Attr(data-foobar)",
      "aTTR(data-foobar)",
      "aTTr(data-foobar)",
      "aTtR(data-foobar)",
      "atTR(data-foobar)",
      "aTtr(data-foobar)",
      "atTr(data-foobar)",
      "attR(data-foobar)",
      "attr(data-foobar)",
    ];
    const notAttributeUsage: string[] = [
      "42px",
      "\"foobar\"",
    ];

    test("the name", function() {
      const result = getAttributeUsageExpressionFactory();
      expect(result.name).to.equal(optionName);
    });

    suite("The `prefix` option", function() {
      let prefix: string;

      setup(function() {
        const result = getAttributeUsageExpressionFactory();
        prefix = result.options.prefix as string;
      });

      test("is defined", function() {
        expect(prefix).not.to.be.undefined;
      });

      test("is a valid regular expression", function() {
        expect(() => new RegExp(prefix)).not.to.throw();
      });

      test("match the `attr()` function", function() {
        for (const testCase of attributeUsage) {
          const regExp = new RegExp(prefix);
          expect(regExp.test(testCase)).to.equal(true, testCase);
        }
      });

      test("don't match not `attr()`", function() {
        for (const testCase of notAttributeUsage) {
          const regExp = new RegExp(prefix);
          expect(regExp.test(testCase)).to.equal(false, testCase);
        }
      });
    });

    suite("The `suffix` option", function() {
      let suffix: string;

      setup(function() {
        const result = getAttributeUsageExpressionFactory();
        suffix = result.options.suffix as string;
      });

      test("is defined", function() {
        expect(suffix).not.to.be.undefined;
      });

      test("is a valid regular expression", function() {
        expect(() => new RegExp(suffix)).not.to.throw();
      });

      test("match the `attr()` function", function() {
        for (const testCase of attributeUsage) {
          const regExp = new RegExp(suffix);
          expect(regExp.test(testCase)).to.equal(true, testCase);
        }
      });

      test("don't match not `attr()`", function() {
        for (const testCase of notAttributeUsage) {
          const regExp = new RegExp(suffix);
          expect(regExp.test(testCase)).to.equal(false, testCase);
        }
      });
    });
  });
});
