import type {
  MangleExpression,
  MultiValueAttributeOptions,
} from "@webmangler/types";

/**
 * Get the set of {@link MangleExpression}s to match multi-value attribute
 * values in CSS. This will match:
 * - Attribute selector values (e.g. `foo` and `bar` in `[data="foo bar"] { }`).
 *
 * @param options The {@link MultiValueAttributeOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.28
 */
function multiValueAttributeExpressionFactory(
  options: MultiValueAttributeOptions,
): Iterable<MangleExpression> {
  const attributesPattern = Array.from(options.attributeNames).join("|");

  return [
    // TODO: add expressions
  ];
}

export default multiValueAttributeExpressionFactory;
