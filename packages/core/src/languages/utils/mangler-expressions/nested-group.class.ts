import type { ManglerExpression } from "../../../types";

import { format as printf } from "util";

/**
 * Type of a the groups object of a Regular Expression match.
 */
type RegExpMatchGroups = { [key: string]: string };

/**
 * A {@link NestedGroupExpression} is a {@link ManglerExpression} implementation
 * that matches and replaces in one-level nested substrings.
 *
 * @example
 * new NestedGroupExpression(
 *   "(?<=')(?<GROUP_NAME>%s)(?=')",
 *   "(?<=\s)([a-z])(?=\s)"
 *   "GROUP_NAME",
 * );
 * // matches "horse" & "battery" in "var pw = 'correct horse battery staple';"
 * // and for the replacements "horse->zebra" and "battery->cell" will change it
 * // into "var pw = 'correct zebra cell staple';"
 *
 * @since v0.1.12
 */
export default class NestedGroupExpression implements ManglerExpression {
  /**
   * The top-level template string to use as (generic) pattern to find
   * substrings in the target string that can be processed by the
   * `subPatternTemplate`.
   */
  private readonly patternTemplate: string;

  /**
   * The sub template string to use as (generic) pattern against substrings
   * produced by `patternTemplate`.
   */
  private readonly subPatternTemplate: string;

  /**
   * The name of the group in `patternTemplate` and `subPatternTemplate` to
   * match and replace.
   */
  private readonly groupName: string;

  /**
   *
   * NOTE 1: whitespace is automatically removed from both templates.
   * NOTE 2: the class assumes the provided group is present in both templates.
   *
   * @param patternTemplate The top-level template.
   * @param subPatternTemplate The sub template.
   * @param groupName The name of a group in both pattern templates.
   * @since v0.1.12
   */
  constructor(
    patternTemplate: string,
    subPatternTemplate: string,
    groupName: string,
  ) {
    this.patternTemplate = patternTemplate.replace(/\s/g, "");
    this.subPatternTemplate = subPatternTemplate.replace(/\s/g, "");
    this.groupName = groupName;
  }

  /**
   * @inheritdoc
   * @since v0.1.12
   */
  public * exec(s: string, pattern: string): IterableIterator<string> {
    const regExp = this.newRegExp(this.patternTemplate, pattern);
    let match: RegExpExecArray | null = null;
    while ((match = regExp.exec(s)) !== null) {
      const groups = match.groups as RegExpMatchGroups;
      const subStr = groups[this.groupName];

      const regExpSub = this.newRegExp(this.subPatternTemplate, pattern);
      let matchSub: RegExpExecArray | null = null;
      while ((matchSub = regExpSub.exec(subStr)) !== null) {
        const subGroups = matchSub.groups as RegExpMatchGroups;
        yield subGroups[this.groupName];
      }
    }
  }

  /**
   * NOTE: not implemented as this function is deprecated.
   *
   * @inheritdoc
   * @throws Always.
   * @since v0.1.12
   * @deprecated
   */
  public replace(): string {
    throw new Error("Not implemented");
  }

  /**
   * @inheritdoc
   * @since v0.1.12
   */
  public replaceAll(
    s: string,
    replacements: Map<string, string>,
  ): string {
    if (replacements.size === 0) {
      return s;
    }

    const pattern = Array.from(replacements.keys()).join("|");
    const regExp = this.newRegExp(this.patternTemplate, pattern);
    const regExpSub = this.newRegExp(this.subPatternTemplate, pattern);
    return s.replace(regExp, (...args: unknown[]): string => {
      const groups = args[args.length - 1] as RegExpMatchGroups;
      const subStr = groups[this.groupName];

      return subStr.replace(regExpSub, (...args: unknown[]): string => {
        const groups = args[args.length - 1] as RegExpMatchGroups;
        const original = groups[this.groupName];
        const replacement = replacements.get(original);
        return replacement as string;
      });
    });
  }

  /**
   * Create a new {@link RegExp} from a given `patternTemplate` and a given
   * string or pattern.
   *
   * @param template The regular expression template.
   * @param pattern The string or pattern of interest.
   * @returns A {@link RegExp} corresponding to the `template` and `pattern`.
   */
  private newRegExp(template: string, pattern: string): RegExp {
    const rawExpr = printf(template, `(?:${pattern})`);
    return new RegExp(rawExpr, "gm");
  }
}
