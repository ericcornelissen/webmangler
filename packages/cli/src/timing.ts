import { performance } from "perf_hooks";

/**
 * Get the duration of a function call in milliseconds as well as its output.
 *
 * @example
 * const [duration, output] = timeCall(() => slowFunction("foobar"));
 * console.log(duration);
 * // 3.14
 *
 * @param fn The function to call.
 * @returns A tuple of the duration and `fn`'s return value.
 */
export function timeCall<T>(fn: () => T): [number, T] {
  const tBefore = performance.now();
  const result = fn();
  const tAfter = performance.now();
  return [tAfter - tBefore, result];
}
