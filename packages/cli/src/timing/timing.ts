interface Time {
  now(): number;
}

/**
 * Create a function to time another function call.
 *
 * @param time A {@link Time} helper.
 * @returns A function to time another function call.
 */
function createTimeCall(time: Time) {
  return function<T>(fn: () => T): [number, T] {
    const tBefore = time.now();
    const result = fn();
    const tAfter = time.now();
    return [tAfter - tBefore, result];
  };
}

export {
  createTimeCall,
};
