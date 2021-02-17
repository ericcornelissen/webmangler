import type { ManglerMatch } from "./mangler-expression.class";

/**
 * Type representing an object of named groups.
 */
type NamedGroupsObject = { [key: string]: string };

/**
 * A {@link ManglerMatch} represents a match obtained for a given pattern by the
 * mangler.
 *
 * @since v0.1.0
 * @deprecated
 */
export default class _ManglerMatch {
  /**
   * Create a {@link ManglerMatch} from a {@link RegExpExecArray}.
   *
   * @param match The {@link RegExpExecArray}.
   * @returns The {@link ManglerMatch} for `match`.
   * @since v0.1.0
   * @deprecated
   */
  static fromExec(match: RegExpExecArray): ManglerMatch {
    return new _ManglerMatch(match, match.groups);
  }

  /**
   * Create a {@link ManglerMatch} from the arguments to a callback function of
   * `string.replace`.
   *
   * @param rawMatch The match represented by an array.
   * @returns The {@link ManglerMatch}.
   * @since v0.1.0
   * @deprecated
   */
  static fromReplace(rawMatch: unknown[]): ManglerMatch {
    return new _ManglerMatch(
      [...rawMatch as string[]],
      rawMatch[rawMatch.length - 1] as NamedGroupsObject,
    );
  }

  /**
   * The list of indexed match groups in the {@link ManglerMatch}.
   */
  private readonly groups: string[] = [];

  /**
   * The collection of named match groups in the {@link ManglerMatch}.
   */
  private readonly namedGroups: NamedGroupsObject;

  /**
   * Create a new match from a list of groups and map of named groups.
   *
   * @param groups The matched groups.
   * @param namedGroups The named matched groups.
   * @deprecated
   */
  private constructor(groups: string[], namedGroups?: NamedGroupsObject) {
    this.groups = groups;
    this.namedGroups = namedGroups || { };
  }

  /**
   * Get the full string that matched.
   *
   * @returns The full string that was matched.
   * @since v0.1.0
   * @deprecated
   */
  getMatchedStr(): string {
    return this.groups[0];
  }

  /**
   * Get the value of a named group in the match.
   *
   * @param index The index of the group.
   * @returns The value of the group, or `""` if the group does not exist.
   * @since v0.1.0
   * @deprecated
   */
  getGroup(index: number): string {
    return this.groups[index] || "";
  }

  /**
   * Get the value of a named group in the match.
   *
   * @param name The name of the named group.
   * @returns The value of the group, or `""` if the group does not exist.
   * @since v0.1.0
   * @deprecated
   */
  getNamedGroup(name: string): string {
    return this.namedGroups[name] || "";
  }
}
