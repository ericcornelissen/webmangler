import type { MangleExpression } from "../../../types";

import { format as printf } from "util";

/**
 * Type of a the groups object of a Regular Expression match.
 */
type RegExpMatchGroups = { [key: string]: string };

/**
 * Normalize a pattern template provided to a built-in {@link MangleExpression}.
 *
 * @param patternTemplate The user-provided pattern template.
 * @param ignoreStrings Should strings be ignored entirely.
 * @returns The normalized pattern template.
 */
function prepareTemplate(
    patternTemplate: string,
    ignoreStrings: boolean,
  ): string {
  if (ignoreStrings) {
    patternTemplate = `
      (?:
        (?:"[^"]*"|'[^']*'|\`[^\`]*\`)
        |
        ${patternTemplate}
      )
    `;
  }

  return patternTemplate.replace(/\s/g, "");
}

/**
 * A {@link SingleGroupMangleExpression} is a {@link MangleExpression}
 * implementation that matches and replaces based on a single named group.
 *
 * @example
 * new SingleGroupMangleExpression(
 *   "(?<=--)(?<GROUP_NAME>%s)(?=--)",
 *   "GROUP_NAME",
 * );
 * // matches "bar" in "foo--bar--" and for the replacement "baz" will change it
 * // into "foo--baz--".
 *
 * @since v0.1.11
 * @version v0.1.20
 */
export default class SingleGroupMangleExpression implements MangleExpression {
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
   * NOTE 2: the class assumes the provided group is present in the template. If
   * it is not this class will fail silently.
   *
   * @param patternTemplate The generic pattern (only one "%s" allowed).
   * @param groupName The name of a group in `patternTemplate`.
   * @param [ignoreStrings] Should strings be ignored entirely.
   * @since v0.1.11
   * @version v0.1.20
   */
  constructor(
    patternTemplate: string,
    groupName: string,
    ignoreStrings = false,
  ) {
    this.patternTemplate = prepareTemplate(patternTemplate, ignoreStrings);
    this.groupName = groupName;
  }

  /**
   * @inheritdoc
   * @since v0.1.11
   * @version v0.1.20
   * @deprecated
   */
  public * exec(s: string, pattern: string): IterableIterator<string> {
    yield * this.findAll(s, pattern);
  }

  /**
   * @inheritdoc
   * @since v0.1.20
   */
  public * findAll(s: string, pattern: string): IterableIterator<string> {
    const regExp = this.newRegExp(pattern);
    let match: RegExpExecArray | null = null;
    while ((match = regExp.exec(s)) !== null) {
      const groups = match.groups as RegExpMatchGroups;
      if (this.didMatch(groups)) {
        yield groups[this.groupName];
      }
    }
  }

  /**
   * @inheritdoc
   * @since v0.1.11
   * @version v0.1.20
   */
  public replaceAll(s: string, replacements: Map<string, string>): string {
    if (replacements.size === 0) {
      return s;
    }

    const pattern = Array.from(replacements.keys()).join("|");
    const regExp = this.newRegExp(pattern);
    return s.replace(regExp, (match: string, ...args: unknown[]): string => {
      const groups = args[args.length - 1] as RegExpMatchGroups;
      if (this.didMatch(groups)) {
        const original = groups[this.groupName];
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
    const rawExpr = printf(this.patternTemplate, pattern);
    return new RegExp(rawExpr, "gm");
  }
}
