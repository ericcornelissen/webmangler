import * as path from "path";

/**
 * Get the type from a file path based on its extension. If the file path does
 * not have an extension an empty string will be returned.
 *
 * @param filePath The file path of interest.
 * @returns The file type.
 * @since v0.1.16
 */
function getTypeFromFilePath(filePath: string): string {
  return path.extname(filePath).substring(1);
}

/**
 * Convert a value or iterable of values into an iterable of values. I.e. if the
 * `input` is a value, it will return a one-value iterable, if the `input` is an
 * iterable it will return the input.
 *
 * NOTE: Strings are not considered to be an iterable by this function, instead
 * if provided with a string this function will return a one-value iterable of
 * that string.
 *
 * @param input The value to convert into an iterable if needed.
 * @returns An iterable based on the input.
 * @since v0.1.0
 * @version v0.1.17
 */
function toArrayIfNeeded<T>(input: T | Iterable<T>): Iterable<T> {
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

export {
  getTypeFromFilePath,
  toArrayIfNeeded,
};
