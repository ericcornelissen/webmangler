import * as path from "path";

/**
 * Filter duplicates from an array.
 *
 * @example
 * const array = ["foo", "bar", "foo", "baz"];
 * const result = array.filter(duplicates);
 * // `result` is `["foo", "bar", "baz"]`
 *
 * @param value A value in the `array`.
 * @param index The (current) index of the value in `array`.
 * @param array An array of values.
 * @returns `true` if this is first appearance of `value`, `false` otherwise.
 * @deprecated
 */
export function duplicates(
  value: unknown,
  index: number,
  array: unknown[],
): boolean {
  const firstAppearanceIndex = array.indexOf(value);
  return index === firstAppearanceIndex;
}

/**
 * Get the type from a file path based on its extension. If the file path does
 * not have an extension an empty string will be returned.
 *
 * @param filePath The file path of interest.
 * @returns The file type.
 * @since v0.1.16
 */
export function getTypeFromFilePath(filePath: string): string {
  return path.extname(filePath).substring(1);
}

/**
 * Convert a value or iterable of values into an iterable of values. I.e. if the
 * `input` is a value, it will return a one-value iterable, if the `input` is an
 * iterable it will return the input.
 *
 * @param input The value to convert into an iterable if needed.
 * @returns Always an iterable based on the input.
 * @since v0.1.0
 * @version v0.1.17
 */
export function toArrayIfNeeded<T>(input: T | Iterable<T>): Iterable<T> {
  if (typeof input === "string") {
    return [input];
  }

  const inputAsIterable = input as Iterable<T>;
  if (typeof inputAsIterable[Symbol.iterator] === "function") {
    return inputAsIterable;
  }

  const inputAsValue = input as T;
  return [inputAsValue];
}
