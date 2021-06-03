import type { CssDeclarationValues, CssDeclarationBlockValues } from "./types";

/**
 * Create a syntactically valid CSS declaration from a collection of values.
 *
 * @param values The values to construct a CSS declaration from.
 * @returns A CSS declaration.
 */
function createCssDeclaration(
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
 * Create a syntactically valid CSS declarations from a list of collections of
 * values.
 *
 * @param declarationsValues One or more {@link CssDeclarationValues}.
 * @returns CSS declarations.
 */
export function createCssDeclarations(
  declarationsValues: Iterable<CssDeclarationValues>,
): string {
  return Array.from(declarationsValues).reduce((s, declarationValues) => {
    return s + createCssDeclaration(declarationValues);
  }, "");
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
 * Create a syntactically valid CSS blocks from a list of collections of values.
 *
 * @param blocksValues Zero or more {@link CssDeclarationBlockValues}.
 * @returns A string of CSS blocks.
 */
export function createCssDeclarationBlocks(
  blocksValues: Iterable<CssDeclarationBlockValues>,
): string {
  return Array.from(blocksValues).reduce((s, blockValues) => {
    return s + createCssDeclarationBlock(blockValues);
  }, "");
}

/**
 * Generate key-value objects from a key-(many values) object.
 *
 * @param valuesSource The source of possible values.
 * @yields An object for all possible combinations of values in the input.
 */
export function* generateValueObjects<T extends string>(
  valuesSource: { [key in T]?: Iterable<string> },
): IterableIterator<{ [key in T]: string }> {
  const entry = Object.entries(valuesSource).pop();
  if (entry === undefined) {
    yield { } as { [key in T]: string };
  } else {
    const [key, values] = entry as [T, string[]];

    const clone = Object.assign({ }, valuesSource);
    delete clone[key];

    for (const value of values) {
      for (const obj of generateValueObjects(clone)) {
        yield Object.assign({ [key]: value }, obj);
      }
    }
  }
}

/**
 * Generate arrays of key-value objects from arrays of key-(many values) object.
 *
 * @param valuesSources Any number of sources of possible values.
 * @yields All possible combinations of objects for each entry in the input.
 */
export function* generateValueObjectsAll<T extends string>(
  valuesSources: Iterable<{ [key in T]?: Iterable<string> }>,
): IterableIterator<Iterable<{ [key in T]?: string }>> {
  const clone = Array.from(valuesSources);
  const current = clone.shift();
  if (current === undefined) {
    yield [];
  } else {
    for (const instance of generateValueObjects(current)) {
      for (const otherInstances of generateValueObjectsAll(clone)) {
        yield [instance, ...otherInstances];
      }
    }
  }
}


