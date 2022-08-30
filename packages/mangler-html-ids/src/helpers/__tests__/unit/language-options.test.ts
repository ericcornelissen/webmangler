import { expect } from "chai";

import {
  getIdAttributeExpressionOptions,
  getQuerySelectorExpressionOptions,
  getUrlAttributeExpressionOptions,
} from "../../language-options";

suite("HTML ID Mangler language-options helpers", function() {
  suite("::getIdAttributeExpressionOptions", function() {
    const optionName = "single-value-attributes";

    const STANDARD_ID_ATTRIBUTES: string[] = [
      "id",
      "for",
    ];

    test("the name", function() {
      const result = getIdAttributeExpressionOptions({ });
      expect(result.name).to.equal(optionName);
    });

    test("the `attributeNames` option, no configured attributes", function() {
      const result = getIdAttributeExpressionOptions({ });
      const attributeNames = Array.from(result.options.attributeNames);

      expect(attributeNames).to.include.members(STANDARD_ID_ATTRIBUTES);
      expect(attributeNames).to.have.length(STANDARD_ID_ATTRIBUTES.length);
    });

    test("the `attributeNames` option, with configured attributes", function() {
      const idAttributes: string[] = ["foo", "bar"];

      const result = getIdAttributeExpressionOptions({ idAttributes });
      const attributeNames = Array.from(result.options.attributeNames);

      expect(attributeNames).to.include.members(STANDARD_ID_ATTRIBUTES);
      expect(attributeNames).to.include.members(idAttributes);
      expect(attributeNames).to.have.length(
        STANDARD_ID_ATTRIBUTES.length + idAttributes.length,
      );
    });

    test("the `valuePrefix` option", function() {
      const result = getIdAttributeExpressionOptions({ });
      const valuePrefix = result.options.valuePrefix;
      expect(valuePrefix).to.be.undefined;
    });

    test("the `valueSuffix` option", function() {
      const result = getIdAttributeExpressionOptions({ });
      const valueSuffix = result.options.valueSuffix;
      expect(valueSuffix).to.be.undefined;
    });
  });

  suite("::getQuerySelectorExpressionOptions", function() {
    const optionName = "query-selectors";

    test("the name", function() {
      const result = getQuerySelectorExpressionOptions();
      expect(result.name).to.equal(optionName);
    });

    test("the `prefix` option", function() {
      const result = getQuerySelectorExpressionOptions();
      const prefix = result.options.prefix;
      expect(prefix).to.equal("#");
    });

    test("the `suffix` option", function() {
      const result = getQuerySelectorExpressionOptions();
      const suffix = result.options.suffix;
      expect(suffix).to.be.undefined;
    });
  });

  suite("::getUrlAttributeExpressionOptions", function() {
    const optionName = "single-value-attributes";

    const STANDARD_URL_ATTRIBUTES: string[] = [
      "href",
    ];

    test("the name", function() {
      const result = getUrlAttributeExpressionOptions({ });
      expect(result.name).to.equal(optionName);
    });

    test("the `attributeNames` option, no configured attributes", function() {
      const result = getUrlAttributeExpressionOptions({ });
      const attributeNames = Array.from(result.options.attributeNames);

      expect(attributeNames).to.include.members(STANDARD_URL_ATTRIBUTES);
      expect(attributeNames).to.have.length(STANDARD_URL_ATTRIBUTES.length);
    });

    test("the `attributeNames` option, with configured attributes", function() {
      const urlAttributes: string[] = ["praise", "the", "sun"];

      const result = getUrlAttributeExpressionOptions({ urlAttributes });
      const attributeNames = Array.from(result.options.attributeNames);

      expect(attributeNames).to.include.members(STANDARD_URL_ATTRIBUTES);
      expect(attributeNames).to.include.members(urlAttributes);
      expect(attributeNames).to.have.length(
        STANDARD_URL_ATTRIBUTES.length + urlAttributes.length,
      );
    });

    test("the `valuePrefix` option", function() {
      const result = getUrlAttributeExpressionOptions({ });
      const valuePrefix = result.options.valuePrefix;
      expect(valuePrefix).to.equal("[a-zA-Z0-9\\-_/.?]*(\\?[a-zA-Z0-9_\\-=%]+)?#");
    });

    test("the `valueSuffix` option", function() {
      const result = getUrlAttributeExpressionOptions({ });
      const valueSuffix = result.options.valueSuffix;
      expect(valueSuffix).to.be.undefined;
    });
  });
});
