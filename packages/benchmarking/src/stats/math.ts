/**
 * Get the median from a collection of numbers.
 *
 * @param numbers A collection of numbers.
 * @returns The median number.
 */
function medianOf(numbers: ReadonlyArray<number>): number {
  const sortedNumbers = Array.prototype.sort.apply(numbers, [(a, b) => a - b]);

  const n = numbers.length;
  const middle = Math.floor(n / 2);
  if (n % 2) {
    return sortedNumbers[middle];
  } else {
    return (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2;
  }
}

export {
  medianOf,
};
