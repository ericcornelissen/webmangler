import type { TestCase } from "./types";

import { deepStrictEqual } from "assert";
import { format as printf } from "util";

import { toArrayIfNeeded } from "../../helpers";

/**
 * Clone an object and, optionally, replace some of the values in the object.
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
 * @param value The current value.
 * @param index The index of the value.
 * @param arr The full array being filtered.
 * @returns `true` if this is the first instance of `value`, `false` otherwise.
 */
function duplicates<T>(value: T, index: number, arr: T[]): boolean {
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
 * Generate an array of length `n` of strings formatted based on the provided
 * template using the index of the string in the array.
 *
 * @param n The desired length of the array.
 * @param template A string containing one "%s" where the index is inserted.
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
 * Check if the provided string is a valid class name.
 *
 * @param s The string of interest.
 * @returns `true` if `s` is a valid class name, `false` otherwise.
 */
export function isValidClassName(s: string): boolean {
  return /^[a-zA-Z-_]*$/.test(s);
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
 * @param language The language the snippets are in.
 * @param testCase The {@link TestCase} to vary.
 * @returns A variation of `testCase` for every quote allowed by `language`.
 */
export function varyQuotes(
  language: QuoteLanguages,
  testCase: TestCase,
): TestCase[] {
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
}

/**
 * Expand a single {@link TestCase} to multiple similar {@link TestCase}s that
 * have varied spacing.
 *
 * If multiple strings are provided, every combination of spacing is created.
 * Hence, this function outputs exponentially many {@link TestCase}s.
 *
 * @param strings The string(s) to vary the spacing around.
 * @param testCase The {@link TestCase} to vary the spacing in.
 * @returns One or more {@link TestCase}s based on `testCase`.
 */
export function varySpacing(
  strings: string | string[],
  testCase: TestCase,
): TestCase[] {
  strings = toArrayIfNeeded(strings);

  const result: TestCase[] = [testCase];
  strings.forEach((str) => {
    result.forEach((entry) => {
      const spaceBeforeCase = cloneObject(entry, {
        input: entry.input.replace(str, ` ${str}`),
        expected: entry.expected.replace(str, ` ${str}`),
      });
      const spaceAfterCase = cloneObject(entry, {
        input: entry.input.replace(str, `${str} `),
        expected: entry.expected.replace(str, `${str} `),
      });
      const spaceSurroundingCase = cloneObject(entry, {
        input: entry.input.replace(str, ` ${str} `),
        expected: entry.expected.replace(str, ` ${str} `),
      });

      if (entry.input !== spaceBeforeCase.input) {
        result.push(spaceBeforeCase, spaceAfterCase, spaceSurroundingCase);
      }
    });
  });

  return result;
}
