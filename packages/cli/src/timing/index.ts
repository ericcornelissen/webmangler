import { performance } from "node:perf_hooks";

import  { createTimeCall } from "./timing";

/**
 * Get the duration of a function call in milliseconds as well as its output.
 *
 * @example
 * const [duration, output] = timeCall(() => slowFunction("foobar"));
 * console.log(duration);
 * // 3.14
 * @param fn The function to time.
 * @returns A tuple of the duration and `fn`'s return value.
 */
const timeCall = createTimeCall(performance);

export {
  timeCall,
};
