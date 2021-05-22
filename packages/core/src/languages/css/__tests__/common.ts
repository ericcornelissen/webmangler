import type { CssDeclarationValues, CssDeclarationBlockValues } from "./types";

/**
 * Create a syntactically valid CSS declaration from a collection of values.
 *
 * @param values The values to construct a CSS declaration from.
 * @returns A CSS declaration.
 */
export function createDeclaration(
  values: CssDeclarationValues,
): string {
  const {
    beforeProperty = "",
    property = "color",
    afterProperty = "",
    beforeValue = "",
    value = "red",
    afterValue = "",
  } = values;

  return beforeProperty +
    property +
    afterProperty +
    ":" +
    beforeValue +
    value +
    afterValue +
    ";";
}
/**
 * Create a syntactically valid CSS declarations block from a collection of
 * values.
 *
 * @param values The values to construct a CSS declarations block from.
 * @returns A CSS declarations block.
 */
export function createCssDeclarationBlock(
  values: CssDeclarationBlockValues,
): string {
  const {
    beforeSelector = "",
    selector = "",
    afterSelector = "",
    declarations = "",
  } = values;

  return beforeSelector +
    selector +
    afterSelector +
    "{" +
    declarations +
    "}";
}

/**
 * Generate key-value objects from a key-(many values) object.
 *
 * @param valuesMap The source of possible values.
 * @yields An object for eery possible combination of values in the `valuesMap`.
 */
export function* generateValueObjects<T extends string>(
  valuesMap: { [key in T]?: Iterable<string> },
): IterableIterator<{ [key in T]: string }> {
  const entry = Object.entries(valuesMap).pop();
  if (entry === undefined) {
    yield { } as { [key in T]: string };
  } else {
    const [key, values] = entry as [T, string[]];

    const clone = Object.assign({ }, valuesMap);
    delete clone[key];

    for (const value of values) {
      for (const obj of generateValueObjects(clone)) {
        yield Object.assign({ [key]: value }, obj);
      }
    }
  }
}
