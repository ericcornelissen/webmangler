import type { ManglerExpression } from "../../types";

import { format as printf } from "util";

/**
 * Type of a the groups object of a Regular Expression match.
 */
type RegExpMatchGroups = { [key: string]: string };

/**
 * A {@link SingleGroupManglerExpression} is a {@link ManglerExpression}
 * implementation that matches and replaces based on a single named group.
 *
 * @example
 * new SingleGroupManglerExpression(
 *   "(?<=--)(?<GROUP_NAME>%s)(?=--)",
 *   "GROUP_NAME",
 * );
 * // matches "bar" in "foo--bar--" and for the replacement "baz" will change it
 * // into "foo--baz--".
 *
 * @since v0.1.11
 */
export default class SingleGroupManglerExpression implements ManglerExpression {
  /**
   * The template string to use as (generic) pattern.
   */
  private readonly patternTemplate: string;

  /**
   * The name of the group in `patternTemplate` to match and replace.
   */
  private readonly groupName: string;

  /**
   * Create an expression from a pattern template with a named group to match
   * and replace.
   *
   * NOTE 1: whitespace is automatically removed from `patternTemplate`.
   * NOTE 2: the class assumes the provided group is present in the template.
   *
   * @param patternTemplate The generic pattern (only one "%s" allowed).
   * @param groupName The name of a group in `patternTemplate`.
   * @since v0.1.11
   */
  constructor(
    patternTemplate: string,
    groupName: string,
  ) {
    this.patternTemplate = patternTemplate.replace(/\s/g, "");
    this.groupName = groupName;
  }

  /**
   * @inheritdoc
   * @since v0.1.11
   */
  public * exec(s: string, pattern: string): IterableIterator<string> {
    const regExp = this.newRegExp(pattern);
    let match: RegExpExecArray | null = null;
    while ((match = regExp.exec(s)) !== null) {
      const groups = match.groups as RegExpMatchGroups;
      yield groups[this.groupName];
    }
  }

  /**
   * NOTE: not implemented as this function is deprecated.
   *
   * @inheritdoc
   * @throws Always.
   * @since v0.1.11
   * @deprecated
   */
  public replace(): string {
    throw new Error("Not implemented");
  }

  /**
   * @inheritdoc
   * @since v0.1.11
   */
  public replaceAll(s: string, replacements: Map<string, string>): string {
    if (replacements.size === 0) {
      return s;
    }

    const pattern = Array.from(replacements.keys()).join("|");
    const regExp = this.newRegExp(pattern);
    return s.replace(regExp, (...args: unknown[]): string => {
      const groups = args[args.length - 1] as RegExpMatchGroups;
      const original = groups[this.groupName];
      const replacement = replacements.get(original);
      return replacement as string;
    });
  }

  /**
   * Create a new {@link RegExp} from the `patternTemplate` for a given string
   * or pattern.
   *
   * @param pattern The string or pattern of interest.
   * @returns A {@link RegExp} corresponding to this expression and `pattern`.
   */
  private newRegExp(pattern: string): RegExp {
    const rawExpr = printf(this.patternTemplate, pattern);
    return new RegExp(rawExpr, "gm");
  }
}
