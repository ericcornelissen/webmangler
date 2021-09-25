import { expect } from "chai";

import {
  getClassAttributeExpressionOptions,
  getQuerySelectorExpressionOptions,
} from "../../language-options";

suite("CSS Class Mangler prefix helpers", function() {
  suite("::getClassAttributeExpressionOptions", function() {
    const STANDARD_CLASS_ATTRIBUTES: string[] = [
      "class",
    ];

    const optionName = "multi-value-attributes";

    suite("No attributes", function() {
      test("the name", function() {
        const result = getClassAttributeExpressionOptions();
        expect(result.name).to.equal(optionName);
      });

      test("the `attributeNames` option", function() {
        const _result = getClassAttributeExpressionOptions();
        const result = Array.from(_result.options.attributeNames);

        expect(result).to.include.members(STANDARD_CLASS_ATTRIBUTES);
        expect(result).to.have.length(STANDARD_CLASS_ATTRIBUTES.length);
      });
    });

    suite("Custom attributes", function() {
      type TestCase = {
        readonly name: string;
        readonly attributes: string[];
        readonly expected: string[];
      }

      const testCases: TestCase[] = [
        {
          name: "Empty list",
          attributes: [],
          expected: [...STANDARD_CLASS_ATTRIBUTES],
        },
        {
          name: "The standard list of attributes",
          attributes: [...STANDARD_CLASS_ATTRIBUTES],
          expected: [...STANDARD_CLASS_ATTRIBUTES],
        },
        {
          name: "Only custom attributes",
          attributes: ["foo", "bar"],
          expected: [...STANDARD_CLASS_ATTRIBUTES, "foo", "bar"],
        },
        {
          name: "Custom attributes & the standard list of attributes",
          attributes: [...STANDARD_CLASS_ATTRIBUTES, "foo", "bar"],
          expected: [...STANDARD_CLASS_ATTRIBUTES, "foo", "bar"],
        },
        {
          name: "With duplicates",
          attributes: ["foobar", "foobar"],
          expected: [...STANDARD_CLASS_ATTRIBUTES, "foobar"],
        },
      ];

      for (const { name, attributes, expected } of testCases) {
        suite(name, function() {
          test("the name", function() {
            const result = getClassAttributeExpressionOptions(attributes);
            expect(result.name).to.equal(optionName);
          });

          test("the `attributeNames` option", function() {
            const _result = getClassAttributeExpressionOptions(attributes);
            const result = Array.from(_result.options.attributeNames);

            expect(result).to.include.members(expected);
            expect(result).to.have.length(expected.length);
          });
        });
      }
    });
  });

  suite("::getQuerySelectorExpressionOptions", function() {
    const optionName = "query-selectors";

    suite("No attributes", function() {
      test("the name", function() {
        const result = getQuerySelectorExpressionOptions();
        expect(result.name).to.equal(optionName);
      });

      test("the `prefix` option", function() {
        const _result = getQuerySelectorExpressionOptions();
        const result = _result.options.prefix;
        expect(result).to.equal("\\.");
      });
    });
  });
});
