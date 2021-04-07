import type { TestCase } from "./types";

import { deepStrictEqual } from "assert";
import { curry } from "ramda";
import { format as printf } from "util";

/**
 * Clone an object and, optionally, replace some of the values in the object.
 *
 * @example
 * const original = { a: "foo", b: "bar" };
 * const clone = cloneObject(original);
 * // original !== clone
 *
 * @example
 * const clone = cloneObject({ a: "foo", b: "bar" }, { b: "baz" });
 * // clone.b === "baz"
 *
 * @param o The object to clone.
 * @param r The keys to replace.
 * @returns The cloned object with replaced values.
 */
function cloneObject<T>(o: T, r?: unknown): T {
  return Object.assign({}, o, r);
}

/**
 * A helper function for `Array.prototype.filter` to filter out any duplicates
 * in an array.
 *
 * @example
 * array.filter(duplicates);
 *
 * @param value The current value.
 * @param index The index of the value.
 * @param arr The full array being filtered.
 * @returns `true` if this is the first instance of `value`, `false` otherwise.
 */
function duplicates(value: unknown, index: number, arr: unknown[]): boolean {
  const firstIndexOfValue = arr.findIndex((x) => {
    try {
      deepStrictEqual(x, value);
      return true;
    } catch (_) {
      return false;
    }
  });

  return firstIndexOfValue === index;
}

/**
 * Escape any characters that have a special in Regular Expressions in a string.
 *
 * @param s The string to escape.
 * @returns The escaped string.
 */
function escapeRegex(s: string): string {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

/**
 * Generate an array of length `n` of strings formatted based on the provided
 * template using the index of the string in the array.
 *
 * The behaviour is undefined if `template` contains 0 or more than ` "%s", but
 * the function won't fail.
 *
 * @example
 * const array = getArrayOfFormattedStrings(3, "-%s-");
 * // array === ["-0-", "-1-", "-2-"]
 *
 * @param n The desired length of the array.
 * @param template A string with a single "%s" where the index will be inserted.
 * @returns The generated array.
 */
export function getArrayOfFormattedStrings(
  n: number,
  template: string,
): string[] {
  const nArray: string[] = ".".repeat(n).split("");
  return nArray.map((_, i) => printf(template, i));
}

/**
 * Check if the provided string is a valid HTML attribute name.
 *
 * @example
 * const isValid = isValidAttributeName("data-foo");
 * // isValid === true
 *
 * @example
 * const isValid = isValidIdName("spaces are not allowed in attribute names");
 * // isValid === false
 *
 * @param attrName The string of interest.
 * @returns `true` if `attrName` is a valid attribute name, `false` otherwise.
 */
export function isValidAttributeName(attrName: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9_-]+$/.test(attrName);
}

/**
 * Check if the provided string is a valid class name.
 *
 * @example
 * const isValid = isValidClassName("foo");
 * // isValid === true
 *
 * @example
 * const isValid = isValidClassName(".foo");
 * // isValid === false
 *
 * @param className The string of interest.
 * @returns `true` if `className` is a valid class name, `false` otherwise.
 */
export function isValidClassName(className: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_-]+$/.test(className);
}

/**
 * Check if the provided string is a valid id name.
 *
 * @example
 * const isValid = isValidIdName("foo");
 * // isValid === true
 *
 * @example
 * const isValid = isValidIdName("#foo");
 * // isValid === false
 *
 * @param idName The string of interest.
 * @returns `true` if `idName` is a valid id name, `false` otherwise.
 */
export function isValidIdName(idName: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(idName);
}

/**
 * Permute a list of objects. That is, create a list of objects such that every
 * possible combination of key-value pairs in the input objects appears once.
 *
 * @param objects The objects to permute.
 * @returns The list of all possible permutations of `object`.
 */
export function permuteObjects<T>(objects: T[]): T[] {
  if (objects.length === 0) {
    return [];
  }

  const result: T[] = [{} as T];
  let w = {} as T;
  objects.forEach((value, i) => {
    w = Object.assign(w, value);
    const otherObjects = objects.filter((_, j) => i !== j);
    result.push(...permuteObjects(otherObjects));
  });

  result.push(w as T);
  return result.filter(duplicates);
}

/**
 * Type representing the languages supported by the {@link varyQuotes} function.
 */
export type QuoteLanguages =
  "css" | "html" | "js" | "single-backticks" | "double-backticks";

/**
 * Vary the quotes used in the snippets of code of `testCase` for a certain
 * `language`.
 *
 * Note: this function is curried by default.
 *
 * @param language The language `testCase` is written in.
 * @param testCase The {@link TestCase} to vary.
 * @returns A variation of `testCase` for every quote allowed by `language`.
 */
export const varyQuotes = curry((
  language: QuoteLanguages,
  testCase: TestCase,
): TestCase[] => {
  const doubleQuotesAllowed = ["css", "html", "js", "double-backticks"];
  const singleQuotesAllowed = ["css", "html", "js", "single-backticks"];
  const backticksAllowed = ["js", "double-backticks", "single-backticks"];

  const doubleQuotes = cloneObject(testCase, {
    input: testCase.input.replace(/('|`)/g, "\""),
    expected: testCase.expected.replace(/('|`)/g, "\""),
  });

  const result: TestCase[] = [];
  if (doubleQuotesAllowed.includes(language)) {
    result.push(doubleQuotes);
  }
  if (singleQuotesAllowed.includes(language)) {
    const singleQuotes = cloneObject(testCase, {
      input: doubleQuotes.input.replace(/"/g, "'"),
      expected: doubleQuotes.expected.replace(/"/g, "'"),
    });

    if (!result.find(({ input }) => input === singleQuotes.input)) {
      result.push(singleQuotes);
    }
  }
  if (backticksAllowed.includes(language)) {
    const backticks = cloneObject(testCase, {
      input: doubleQuotes.input.replace(/"/g, "`"),
      expected: doubleQuotes.expected.replace(/"/g, "`"),
    });

    if (!result.find(({ input }) => input === backticks.input)) {
      result.push(backticks);
    }
  }

  return result;
});

/**
 * Expand a single {@link TestCase} to multiple similar {@link TestCase}s that
 * have varied spacing.
 *
 * If multiple strings are provided, every combination of spacing is created.
 * Hence, this function outputs exponentially many {@link TestCase}s.
 *
 * Note: this function is curried by default.
 *
 * @param strings The string(s) to vary the spacing around.
 * @param testCase The {@link TestCase} to vary the spacing in.
 * @returns One or more {@link TestCase}s based on `testCase`.
 */
export const varySpacing = curry((
  strings: string | string[],
  testCase: TestCase,
): TestCase[] => {
  if (strings.length === 0) {
    return [testCase];
  }

  strings = Array.isArray(strings) ? strings : [strings];

  const result: TestCase[] = [testCase];
  strings.forEach((str) => {
    result.forEach((entry) => {
      const regExp = new RegExp(escapeRegex(str), "g");
      const spaceBeforeCase = cloneObject(entry, {
        input: entry.input.replace(regExp, ` ${str}`),
        expected: entry.expected.replace(regExp, ` ${str}`),
      });
      const spaceAfterCase = cloneObject(entry, {
        input: entry.input.replace(regExp, `${str} `),
        expected: entry.expected.replace(regExp, `${str} `),
      });
      const spaceSurroundingCase = cloneObject(entry, {
        input: entry.input.replace(regExp, ` ${str} `),
        expected: entry.expected.replace(regExp, ` ${str} `),
      });

      if (entry.input !== spaceBeforeCase.input) {
        result.push(spaceBeforeCase, spaceAfterCase, spaceSurroundingCase);
      }
    });
  });

  return result;
});
