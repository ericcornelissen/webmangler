import type { MangleExpression } from "@webmangler/types";

import type { RegExpMatchGroups } from "./types";

import { format as printf } from "util";

/**
 * The configuration options of a {@link SingleGroupMangleExpression}.
 *
 * @since v0.1.25
 * @version v0.1.28
 */
interface SingleGroupMangleExpressionOptions {
  /**
   * A string representing a regular expression to find and replace substrings
   * of a string.
   *
   * It must contain {@link SingleGroupMangleExpression.CAPTURE_GROUP} or an
   * error will be throw.
   *
   * _Notes_
   * 1. The regular expression is not allowed to contain a capturing group with
   * the name {@link GROUP_FIND_AND_REPLACE}.
   * 2. Whitespace is automatically removed from this template.
   *
   * @example
   * `
   *   (?<=--)
   *   ${SingleGroupMangleExpression.CAPTURE_GROUP}
   *   (?=--)
   * `
   * @since v0.1.11
   * @version v0.1.27
   */
  readonly patternTemplate: string;

  /**
   * Should the expression be case sensitive.
   *
   * @default true
   * @since v0.1.24
   */
  readonly caseSensitive?: boolean;
}

/**
 * The name of the capturing group in a template that will be found and
 * replaced.
 */
const GROUP_FIND_AND_REPLACE = "SingleGroupMangleExpressionCapturingGroup";

/**
 * A {@link SingleGroupMangleExpression} is a {@link MangleExpression}
 * implementation that matches and replaces based on a single named group.
 *
 * @example
 * new SingleGroupMangleExpression({
 *   patternTemplate: `
 *     (?<=--)
 *     ${SingleGroupMangleExpression.CAPTURE_GROUP}
 *     (?=--)
 *   `,
 * });
 * // matches "bar" in "foo--bar--" and for the replacement "baz" will change it
 * // into "foo--baz--".
 * @since v0.1.11
 * @version v0.1.28
 */
class SingleGroupMangleExpression implements MangleExpression {
  /**
   * The capturing group to be found and replaced.
   */
  public static readonly CAPTURE_GROUP: string =
    `(?<${GROUP_FIND_AND_REPLACE}>%s)`;

  /**
   * The template string to use as (generic) pattern.
   */
  private readonly patternTemplate: string;

  /**
   * The name of the group in `patternTemplate` to match and replace.
   */
  private readonly groupName: string;

  /**
   * A boolean indicating whether or not the expression is case sensitive.
   */
  private readonly caseSensitive: boolean;

  /**
   * Create an expression from a pattern template with a named group to match
   * and replace.
   *
   * @param params The {@link SingleGroupMangleExpressionOptions}.
   * @throws If {@link SingleGroupMangleExpression.CAPTURE_GROUP} is missing.
   * @since v0.1.11
   * @version v0.1.28
   */
  constructor(params: SingleGroupMangleExpressionOptions) {
    this.patternTemplate = params.patternTemplate.replace(/\s/g, "");
    this.groupName = GROUP_FIND_AND_REPLACE;
    this.caseSensitive = params.caseSensitive === undefined ?
      true : params.caseSensitive;

    if (
      !this.patternTemplate.includes(SingleGroupMangleExpression.CAPTURE_GROUP)
    ) {
      throw new Error("Missing CAPTURE_GROUP from patternTemplate");
    }
  }

  /**
   * @inheritDoc
   * @version v0.1.24
   */
  public * findAll(s: string, pattern: string): IterableIterator<string> {
    const regExp = this.newRegExp(pattern);
    let match: RegExpExecArray | null = null;
    while ((match = regExp.exec(s)) !== null) {
      const groups = match.groups as RegExpMatchGroups;
      if (this.didMatch(groups)) {
        if (this.caseSensitive) {
          yield groups[this.groupName];
        } else {
          yield groups[this.groupName].toLowerCase();
        }
      }
    }
  }

  /**
   * @inheritDoc
   * @version v0.1.26
   */
  public replaceAll(
    s: string,
    replacements: ReadonlyMap<string, string>,
  ): string {
    if (replacements.size === 0) {
      return s;
    }

    const pattern = Array.from(replacements.keys()).join("|");
    const regExp = this.newRegExp(pattern);
    return s.replace(regExp, (
      match: string,
      ...args: ReadonlyArray<unknown>
    ): string => {
      const groups = args[args.length - 1] as RegExpMatchGroups;
      if (this.didMatch(groups)) {
        let original = groups[this.groupName];
        if (!this.caseSensitive) {
          original = original.toLowerCase();
        }
        const replacement = replacements.get(original);
        return replacement as string;
      } else {
        return match;
      }
    });
  }

  /**
   * Determine if the configured group matched.
   *
   * @param groups The {@link RegExpMatchGroups}.
   * @returns `true` if the configured group matched, `false` otherwise.
   */
  private didMatch(groups: RegExpMatchGroups): boolean {
    return groups[this.groupName] !== undefined;
  }

  /**
   * Create a new {@link RegExp} from the `patternTemplate` for a given string
   * or pattern.
   *
   * @param pattern The string or pattern of interest.
   * @returns A {@link RegExp} corresponding to this expression and `pattern`.
   */
  private newRegExp(pattern: string): RegExp {
    const flags = this.getRegExpFlags();
    const rawExpr = printf(this.patternTemplate, pattern);
    return new RegExp(rawExpr, flags);
  }

  /**
   * Get the flags given the instance options.
   *
   * @returns A string of {@link RegExp} flags.
   */
  private getRegExpFlags(): string {
    const baseFlags = "gm";
    if (!this.caseSensitive) {
      return `${baseFlags}i`;
    }

    return baseFlags;
  }
}

export default SingleGroupMangleExpression;

export type {
  SingleGroupMangleExpressionOptions,
};
