/**
 * Type of a the groups object of a Regular Expression match.
 */
interface RegExpMatchGroups {
  /**
   * The (last) matched value for the name with the given group.
   */
  [key: string]: string;
}

export type {
  RegExpMatchGroups,
};
