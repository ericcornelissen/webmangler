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
