import { deepStrictEqual } from "assert";

import { toArrayIfNeeded } from "../../helpers";
import { TestCase } from "./testing";

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
 * Vary the quotes used in the snippets of code of `testCase` for a certain
 * `language`.
 *
 * @param language The language the snippets are in.
 * @param testCase The {@link TestCase} to vary.
 * @returns A variation of `testCase` for every quote allowed by `language`.
 */
export function varyQuotes(
  language: "html" | "js",
  testCase: TestCase,
): TestCase[] {
  const singleQuotesAllowed = ["html", "js"];
  const backticksAllowed = ["js"];

  const doubleQuotes = cloneObject(testCase, {
    input: testCase.input.replace(/'/g, "\"").replace(/`/g, "\""),
    expected: testCase.expected.replace(/'/g, "\"").replace(/`/g, "\""),
  });

  const result: TestCase[] = [doubleQuotes];
  if (singleQuotesAllowed.includes(language)) {
    const singleQuotes = cloneObject(testCase, {
      input: doubleQuotes.input.replace(/"/g, "'"),
      expected: doubleQuotes.expected.replace(/"/g, "'"),
    });

    if (singleQuotes.input !== doubleQuotes.input) {
      result.push(singleQuotes);
    }
  }
  if (backticksAllowed.includes(language)) {
    const backticks = cloneObject(testCase, {
      input: doubleQuotes.input.replace(/"/g, "`"),
      expected: doubleQuotes.expected.replace(/"/g, "`"),
    });

    if (backticks.input !== doubleQuotes.input) {
      result.push(backticks);
    }
  }

  return result;
}

/**
 * Expand a single {@link TestCase} to multiple similar {@link TestCase}s that
 * have varied spacing.
 *
 * The provided {@link TestCase} is always the first element in the returned
 * array.
 *
 * @param chars The character(s) to vary the spacing around.
 * @param testCase The {@link TestCase} to vary the spacing in.
 * @returns One or more {@link TestCase}s based on `testCase`.
 */
export function varySpacing(
  chars: string | string[],
  testCase: TestCase,
): TestCase[] {
  chars = toArrayIfNeeded(chars);

  const result: TestCase[] = [testCase];
  for (const char of chars) {
    const spaceBeforeCase = cloneObject(testCase, {
      input: testCase.input.replace(char, ` ${char}`),
      expected: testCase.expected.replace(char, ` ${char}`),
    });
    const spaceAfterCase = cloneObject(testCase, {
      input: testCase.input.replace(char, `${char} `),
      expected: testCase.expected.replace(char, `${char} `),
    });
    const spaceSurroundingCase = cloneObject(testCase, {
      input: testCase.input.replace(char, ` ${char} `),
      expected: testCase.expected.replace(char, ` ${char} `),
    });

    if (testCase.input !== spaceBeforeCase.input) {
      result.push(spaceBeforeCase, spaceAfterCase, spaceSurroundingCase);
    }
  }

  return result;
}
