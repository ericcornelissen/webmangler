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
 * Convert a value or array of values into an array of values. I.e. if the
 * `input` is a value, it will return a one-value array, if the `input` is an
 * array it will return the array.
 *
 * @param input The value to convert into an array if needed.
 * @returns Always an array based on the input.
 * @since v0.1.0
 */
export function toArrayIfNeeded<T>(input: T | T[]): T[] {
  if (Array.isArray(input)) {
    return input;
  }

  return [input];
}
