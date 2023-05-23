import { expect } from "chai";

import {
  getCssVariableDefinitionExpressionOptions,
  getCssVariableUsageExpressionOptions,
} from "../../language-options";

suite("CSS Variable Mangler language-options helpers", function() {
  suite("::getCssVariableDefinitionExpressionOptions", function() {
    const optionName = "css-declaration-properties";

    test("the name", function() {
      const result = getCssVariableDefinitionExpressionOptions();
      expect(result.name).to.equal(optionName);
    });

    test("the `prefix` option", function() {
      const result = getCssVariableDefinitionExpressionOptions();
      const prefix = result.options.prefix;
      expect(prefix).to.equal("--");
    });

    test("the `suffix` option", function() {
      const result = getCssVariableDefinitionExpressionOptions();
      const suffix = result.options.suffix;
      expect(suffix).to.be.undefined;
    });
  });

  suite("::getCssVariableUsageExpressionOptions", function() {
    const optionName = "css-declaration-values";

    test("the name", function() {
      const result = getCssVariableUsageExpressionOptions();
      expect(result.name).to.equal(optionName);
    });

    test("the `prefix` option", function() {
      const result = getCssVariableUsageExpressionOptions();
      const prefix = result.options.prefix;
      expect(prefix).to.equal(
        "(?:VAR|VAr|VaR|Var|vAR|vAr|vaR|var)\\s*\\(\\s*--",
      );
    });

    test("the `suffix` option", function() {
      const result = getCssVariableUsageExpressionOptions();
      const suffix = result.options.suffix;
      expect(suffix).to.equal("\\s*(?:,[^)]+)?\\)");
    });
  });
});
