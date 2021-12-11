import type { TestScenarios } from "@webmangler/testing";

import type {
  IdAttributeExpressionOptions,
  UrlAttributeExpressionOptions,
} from "../../language-options";

import { expect } from "chai";

import { getLanguageOptions } from "../../index";
import {
  getIdAttributeExpressionOptions,
  getQuerySelectorExpressionOptions,
  getUrlAttributeExpressionOptions,
} from "../../language-options";

suite("HTML ID Mangler language-options helpers", function() {
  suite("::getLanguageOptions", function() {
    type TestCase = IdAttributeExpressionOptions
      & UrlAttributeExpressionOptions;

    const scenarios: TestScenarios<TestCase> = [
      {
        testName: "no values",
        getScenario: () => ({}),
      },
      {
        testName: "only ID attributes",
        getScenario: () => ({
          idAttributes: ["foo", "bar"],
        }),
      },
      {
        testName: "only URL attributes",
        getScenario: () => ({
          urlAttributes: ["hello", "world"],
        }),
      },
      {
        testName: "all values",
        getScenario: () => ({
          idAttributes: ["foo", "bar"],
          urlAttributes: ["hello", "world"],
        }),
      },
    ];

    for (const { testName, getScenario } of scenarios) {
      test(`${testName}, has at least one language option`, function() {
        const options = getScenario();

        const result = getLanguageOptions(options);
        expect(result).to.have.length.greaterThan(0);
      });

      test(`${testName}, has the ID attribute options`, function() {
        const options = getScenario();
        const expressionOptions = getIdAttributeExpressionOptions(options);

        const result = getLanguageOptions(options);
        expect(result).to.deep.include(expressionOptions);
      });

      test(`${testName}, has the query selector options`, function() {
        const options = getScenario();
        const expressionOptions = getQuerySelectorExpressionOptions();

        const result = getLanguageOptions(options);
        expect(result).to.deep.include(expressionOptions);
      });

      test(`${testName}, has the URL attribute options`, function() {
        const options = getScenario();
        const expressionOptions = getUrlAttributeExpressionOptions(options);

        const result = getLanguageOptions(options);
        expect(result).to.deep.include(expressionOptions);
      });
    }
  });
});
