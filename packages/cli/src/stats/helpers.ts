/**
 * Get the percentage change between two numbers.
 *
 * @param before The before number.
 * @param after The after number.
 * @returns The percentage difference between `before` and `after`.
 */
export function getChangedPercentage(before: number, after: number): number {
  const percentage = ((after - before) / before) * 100;
  return percentage;
}
