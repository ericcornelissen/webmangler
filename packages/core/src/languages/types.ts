/**
 * Interface representing a match found by a {@link ManglerExpression}.
 *
 * @since v0.1.0
 */
interface ManglerMatch {
  /**
   * Get the full string that was matched.
   *
   * @returns The full string that was matched.
   * @since v0.1.0
   */
  getMatchedStr(): string;

  /**
   * Get the value of a captured group
   *
   * @param index The index of the captured group (starting at 0).
   * @returns The value of group `index`, or `""` if no such group exists.
   * @since v0.1.0
   */
  getGroup(index: number): string;

  /**
   * Get the value of a captured group
   *
   * @param name The name of the captured group.
   * @returns The value of group `name`, or `""` if no such group exists.
   * @since v0.1.0
   */
  getNamedGroup(name: string): string;
}

export type {
  ManglerMatch,
};
