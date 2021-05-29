type CssDeclarationKey = "beforeProperty"
  | "property"
  | "afterProperty"
  | "beforeValue"
  | "value"
  | "afterValue";

type CssDeclarationsBlockKey = "beforeSelector"
  | "selector"
  | "afterSelector"
  | "declarations";

/**
 * Type representing a collection of possible values for the different parts of
 * a CSS declaration.
 */
export type CssDeclarationValuesMap = {
  [key in CssDeclarationKey]?: Iterable<string>;
}

/**
 * Type representing the values for the different parts of a CSS declaration.
 */
export type CssDeclarationValues = {
  [key in CssDeclarationKey]?: string;
}

/**
 * Type representing a collection of possible values for the different parts of
 * a CSS declarations block.
 */
export type CssDeclarationBlockMap = {
  [key in CssDeclarationsBlockKey]?: Iterable<string>;
}

/**
 * Type representing the values for the different parts of a CSS declarations
 * block.
 */
export type CssDeclarationBlockValues = {
  [key in CssDeclarationsBlockKey]?: string;
}

/**
 * Type representing a test case for a CSS language plugin expression factory.
 */
export type TestCase<T> = {
  readonly name: string;
  readonly pattern: string;
  readonly factoryOptions: T;
  readonly expected: string[];
  readonly testValues: CssDeclarationValuesMap[];
}
