/**
 * A collection of functions that assist with time.
 */
interface TimeUtility {
  /**
   * Get the current time as a number.
   *
   * @returns The current time as a number.
   */
  now(): number;
}

/**
 * Create a function to obtain timestamps representing now.
 *
 * @param timeUtility A {@link TimeUtility}.
 * @returns A function to obtain a timestamp representing the time it is called.
 */
function newGetNow(timeUtility: TimeUtility): () => number {
  return (): number => {
    return timeUtility.now();
  };
}

export {
  newGetNow,
};
