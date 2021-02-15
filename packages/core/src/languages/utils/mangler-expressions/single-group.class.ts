import type { ManglerExpression } from "../../types";

import { format as printf } from "util";

import _ManglerMatch from "../mangler-match.class";

/**
 * A {@link SingleGroupManglerExpression} is a {@link ManglerExpression}
 * implementation that matches and replaces based on a single named group.
 *
 * @example
 * new SingleGroupManglerExpression(
 *   "--(?<GROUP_NAME>%s)--",
 *   "GROUP_NAME",
 *   "=%s="
 * );
 * // matches "foo" in "--foo--"
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
   * The template for to use to construct replacement strings.
   */
  private readonly replaceTemplate: string;

  /**
   * Create an expression from a pattern template with a named group to match
   * and replace.
   *
   * NOTE: whitespace is automatically removed from `patternTemplate`.
   *
   * @param patternTemplate The generic pattern (only one "%s" allowed).
   * @param groupName The name of a group in `patternTemplate`.
   * @param replaceTemplate The replacement pattern (only one "%s" allowed).
   * @since v0.1.11
   */
  constructor(
    patternTemplate: string,
    groupName: string,
    replaceTemplate: string,
  ) {
    this.patternTemplate = patternTemplate.replace(/\s/g, "");
    this.groupName = groupName;
    this.replaceTemplate = replaceTemplate;
  }

  /**
   * @inheritdoc
   * @since v0.1.11
   */
  public * exec(s: string, pattern: string): IterableIterator<string> {
    const regExp = this.newRegExp(pattern);
    let match: RegExpExecArray | null = null;
    while ((match = regExp.exec(s)) !== null) {
      const manglerMatch = _ManglerMatch.fromExec(match);
      yield manglerMatch.getNamedGroup(this.groupName);
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
  public replaceAll(
    s: string,
    replacements: Map<string, string>,
  ): string {
    const pattern = Array.from(replacements.keys()).join("|");
    const regExp = this.newRegExp(pattern);
    return s.replace(regExp, (...args: string[]): string => {
      const manglerMatch = _ManglerMatch.fromReplace(args);
      const original = manglerMatch.getNamedGroup(this.groupName);
      const replacement = replacements.get(original);
      return printf(this.replaceTemplate, replacement);
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
