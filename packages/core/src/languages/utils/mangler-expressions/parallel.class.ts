import type { ManglerExpression } from "../../types";

import { format as printf } from "util";

import _ManglerMatch from "../mangler-match.class";

const REG_EXP_FLAGS = "gm";

/**
 * A {@link ManglerExpression} describes a generic pattern to match and replace
 * arbitrary sub-patterns.
 *
 * @since v0.1.11
 */
export default class ParallelManglerExpression implements ManglerExpression {
  /**
   * TODO.
   */
  private readonly patternTemplate: string;

  /**
   * TODO.
   */
  private readonly groupName: string;

  /**
   * TODO.
   */
  private readonly replaceTemplate: string;

  /**
   * TODO.
   *
   * @param patternTemplate The generic pattern (should include only one "%s").
   * @param groupName TODO.
   * @param replaceTemplate TODO.
   * @since v0.1.11
   */
  constructor(
    patternTemplate: string,
    groupName: string,
    replaceTemplate: string,
    // matchParser: MatchParser,
    // matchReplacer: MatchReplacer,
  ) {
    this.patternTemplate = patternTemplate;
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
   * Create a new {@link RegExp} from the pattern template for a given pattern.
   *
   * @param pattern The pattern of interest.
   * @returns A {@link RegExp} corresponding to this expression and `pattern`.
   */
  private newRegExp(pattern: string): RegExp {
    const rawExpr = printf(this.patternTemplate, pattern);
    return new RegExp(rawExpr, REG_EXP_FLAGS);
  }
}
