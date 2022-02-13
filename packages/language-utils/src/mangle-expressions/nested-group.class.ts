import type { MangleExpression } from "@webmangler/types";

import { format as printf } from "util";

/**
 * Type of a the groups object of a Regular Expression match.
 */
type RegExpMatchGroups = {
  [key: string]: string;
};

/**
 * The configuration options of a {@link NestedGroupMangleExpression}.
 *
 * @since v0.1.25
 * @version v0.1.27
 */
interface NestedGroupMangleExpressionOptions {
  /**
   * A string representing a regular expression to find substrings of a string.
   *
   * It must contain {@link NestedGroupMangleExpression.CAPTURE_GROUP} or an
   * error will be throw.
   *
   * NOTE: the regular expression is not allowed to contain a capturing group
   * with the name {@link GROUP_FIND_AND_REPLACE}.
   *
   * @example
   * `
   *   (?<=')
   *   ${NestedGroupMangleExpression.CAPTURE_GROUP({
   *     before: "\\s",
   *     after: "\\s",
   *   })}
   *   (?=')
   * `
   * @since v0.1.11
   * @version v0.1.27
   */
  readonly patternTemplate: string;

  /**
   * A string representing a regular expression to find and replace substrings
   * of strings found by the `patternTemplate`.
   *
   * It must contain {@link NestedGroupMangleExpression.CAPTURE_GROUP} or an
   * error will be throw.
   *
   * NOTE: the regular expression is not allowed to contain a capturing group
   * with the name {@link GROUP_FIND_AND_REPLACE}.
   *
   * @example
   * `
   *   (?<=\\s)
   *   ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
   *   (?=\\s)
   * `
   * @since v0.1.11
   * @version v0.1.27
   */
  readonly subPatternTemplate: string;

  /**
   * The name of a group in `patternTemplate`.
   *
   * NOTE 1: it is assumed the provided group is present in the both templates.
   * If this is not true the failure will be silent.
   *
   * @example "GROUP_NAME"
   * @since v0.1.11
   * @deprecated Use `NestedGroupMangleExpression.CAPTURE_GROUP` and
   * `NestedGroupMangleExpression.SUB_CAPTURE_GROUP` instead.
   */
  readonly groupName?: string;

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
const GROUP_FIND_AND_REPLACE = "NestedGroupMangleExpressionCapturingGroup";

/**
 * A {@link NestedGroupMangleExpression} is a {@link MangleExpression}
 * implementation that matches and replaces in one-level nested substrings.
 *
 * @example
 * new NestedGroupMangleExpression({
 *   patternTemplate: `
 *     (?<=')
 *     ${NestedGroupMangleExpression.CAPTURE_GROUP({
 *       before: "\\s",
 *       after: "\\s",
 *     })}
 *     (?=')
 *   `,
 *   subPatternTemplate: `
 *     (?<=\\s)
 *     ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
 *     (?=\\s)
 *   `,
 * });
 * // matches "horse" & "battery" in "var pw = 'correct horse battery staple';"
 * // and for the replacements "horse->zebra" and "battery->cell" will change it
 * // into "var pw = 'correct zebra cell staple';"
 * @since v0.1.12
 * @version v0.1.27
 */
class NestedGroupMangleExpression implements MangleExpression {
  /**
   * Create a capturing group for a `patternTemplate`.
   *
   * @param options The options for the capturing group.
   * @param options.after The pattern required after the search pattern.
   * @param options.before The pattern required before the search pattern.
   * @returns The capturing group.
   */
  public static readonly CAPTURE_GROUP = ({ before, after }: {
    before: string;
    after: string;
  }) => `
    (?<${GROUP_FIND_AND_REPLACE}>
      ${before}
      %s
      ${after}
    )
  `.replace(/\s/g, "");

  /**
   * The capturing group for a `subPatternTemplate`.
   */
  public static readonly SUB_CAPTURE_GROUP: string =
    `(?<${GROUP_FIND_AND_REPLACE}>%s)`;

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
   * A boolean indicating whether or not the expression is case sensitive.
   */
  private readonly caseSensitive: boolean;

  /**
   * Create an expression from a top-level pattern an sub pattern with a single
   * named group to match and replace.
   *
   * @param params The {@link NestedGroupMangleExpressionOptions}.
   * @since v0.1.12
   * @version v0.1.27
   */
  constructor(params: NestedGroupMangleExpressionOptions) {
    this.patternTemplate = params.patternTemplate.replace(/\s/g, "");
    this.subPatternTemplate = params.subPatternTemplate.replace(/\s/g, "");
    this.groupName = params.groupName || GROUP_FIND_AND_REPLACE;
    this.caseSensitive = params.caseSensitive === undefined ?
      true : params.caseSensitive;

    if (
      !params.groupName &&
      !this.patternTemplate.match(
        `\\(\\?\\<${GROUP_FIND_AND_REPLACE}\\>(.*?)%s(.*?)\\)`,
      )
    ) {
      throw new Error("Missing CAPTURE_GROUP from patternTemplate");
    }

    if (
      !params.groupName &&
      !this.subPatternTemplate.includes(
        NestedGroupMangleExpression.SUB_CAPTURE_GROUP,
      )
    ) {
      throw new Error("Missing SUB_CAPTURE_GROUP from subPatternTemplate");
    }
  }

  /**
   * @inheritdoc
   * @since v0.1.20
   * @version v0.1.24
   */
  public * findAll(s: string, pattern: string): IterableIterator<string> {
    const regExp = this.newRegExp(this.patternTemplate, pattern);
    let match: RegExpExecArray | null = null;
    while ((match = regExp.exec(s)) !== null) {
      const groups = match.groups as RegExpMatchGroups;
      if (this.didMatch(groups)) {
        const subStr = groups[this.groupName];

        const regExpSub = this.newRegExp(this.subPatternTemplate, pattern);
        let matchSub: RegExpExecArray | null = null;
        while ((matchSub = regExpSub.exec(subStr)) !== null) {
          const subGroups = matchSub.groups as RegExpMatchGroups;
          if (this.didMatch(subGroups)) {
            if (this.caseSensitive) {
              yield subGroups[this.groupName];
            } else {
              yield subGroups[this.groupName].toLowerCase();
            }
          }
        }
      }
    }
  }

  /**
   * @inheritdoc
   * @since v0.1.12
   * @version v0.1.26
   */
  public replaceAll(
    str: string,
    replacements: ReadonlyMap<string, string>,
  ): string {
    if (replacements.size === 0) {
      return str;
    }

    const pattern = Array.from(replacements.keys()).join("|");
    const regExp = this.newRegExp(this.patternTemplate, pattern);
    const regExpSub = this.newRegExp(this.subPatternTemplate, pattern);
    return str.replace(regExp, (match: string, ...args: unknown[]): string => {
      const groups = args[args.length - 1] as RegExpMatchGroups;
      if (this.didMatch(groups)) {
        const subStr = groups[this.groupName];
        const newSubStr = subStr.replace(regExpSub, (
          subMatch: string,
          ...subArgs: unknown[]
        ): string => {
          const subGroups = subArgs[subArgs.length - 1] as RegExpMatchGroups;
          if (this.didMatch(subGroups)) {
            let original = this.extractGroup(subArgs);
            if (!this.caseSensitive) {
              original = original.toLowerCase();
            }
            const replacement = replacements.get(original);
            return replacement as string;
          } else {
            return subMatch;
          }
        });
        return match.replace(subStr, newSubStr);
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
   * Get the value of the named group for a `String.prototype.replace` callback.
   *
   * @example
   * str.replace(/foo/g, (...args: unknown[]): string => {
   *   const subStr = this.extractGroup(args);
   *   // ...
   * });
   * @param args The `String.prototype.replace` callback arguments.
   * @returns The value of the configured named group.
   */
  private extractGroup(args: unknown[]): string {
    const groups = args[args.length - 1] as RegExpMatchGroups;
    const groupValue = groups[this.groupName];
    return groupValue;
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
    const flags = this.getRegExpFlags();
    const rawExpr = printf(template, `(?:${pattern})`);
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

export default NestedGroupMangleExpression;
