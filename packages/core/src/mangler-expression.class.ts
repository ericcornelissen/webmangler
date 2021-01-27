import { format as printf } from "util";

import { toArrayIfNeeded } from "./helpers";
import Match from "./mangler-match.class";

const REG_EXP_FLAGS = "gm";

/**
 * A {@link MatchParser} is a function that takes as input a `match` and the
 * `pattern` that produced the match and outputs one or more values that should
 * have been matched.
 *
 * @param pattern The pattern that produced the match.
 * @param match The match that was found in a string.
 * @returns One or more matches that are contained in `match`.
 */
type MatchParser = (pattern: string, match: ManglerMatch) => string[];

/**
 * A {@link MatchReplacer} is a function that takes as input a `match` and a
 * replacement string and outputs the replacement string for the `match`.
 *
 * @param replaceStr The replacement string to be used.
 * @param match The match that was found in a string.
 * @returns The replacement string.
 */
type MatchReplacer = ((replaceStr: string, match: ManglerMatch) => string);

/**
 * A {@link ManglerExpression} describes a generic pattern to match and replace
 * arbitrary sub-patterns.
 *
 * @since v0.1.0
 */
export default class ManglerExpression {
  /**
   * Get a {@link MatchParser} to return the value at a specific index in a
   * match.
   *
   * @param index The index or indices that should be returned for a match.
   * @returns A {@link MatchParser} for the index or indices.
   */
  static matchParserForIndex(index: number | number[]): MatchParser {
    const indices = toArrayIfNeeded(index);
    return (_: string, match: ManglerMatch): string[] => {
      return indices.map((i) => match.getGroup(i));
    };
  }

  /**
   * Get a {@link MatchParser} to return the value of a specific group in a
   * match.
   *
   * @param groupName The group or groups that should be returned for a match.
   * @returns A {@link MatchParser} for the group or groups.
   */
  static matchParserForGroup(groupName: string | string[]): MatchParser {
    const groupNames = toArrayIfNeeded(groupName);
    return (_: string, match: ManglerMatch): string[] => {
      return groupNames.map((name) => match.getNamedGroup(name));
    };
  }

  /**
   * Get a {@link MatchReplacer} for a generic `String.prototype.replace`
   * replacement string template.
   *
   * @example
   * // keep group 1 as prefix for any replacement string %s
   * ManglerExpression.matchReplaceBy("$1%s");
   *
   * @example
   * // keep the group named "prefix" as prefix for any replacement string %s
   * ManglerExpression.matchReplaceBy("$<prefix>%s");
   *
   * @param s The replacement string template.
   * @returns The {@link MatchReplacer} for `s`.
   */
  static matchReplacerBy(s: string): MatchReplacer {
    return (replacementStr: string, match: ManglerMatch): string => {
      const regExp = /\$(?:([0-9])|<([a-z]+)>)/g;
      return printf(s, replacementStr).replace(regExp, (_, ...args): string => {
        if (args[0]) {
          const index = parseInt(args[0]);
          return match.getGroup(index);
        } else {
          const name = args[1];
          return match.getNamedGroup(name);
        }
      });
    };
  }

  /**
   * The template string to be used when converting the matcher to a Regular
   * Expression for a given pattern.
   */
  private readonly patternTemplate: string;

  /**
   * The function to parse matches with.
   */
  private readonly parseMatch: MatchParser;

  /**
   * The function to replace matches with.
   */
  private readonly replaceMatch: MatchReplacer;

  /**
   * Create an expression from a pattern template with a custom match parser and
   * match replacer function.
   *
   * @example
   * // A mangler expression for patterns starting with a leading "." and
   * // trailing "(" or "{", returning the string of the pattern if the match
   * // is parsed, and replacing the leading "." by a "-" if a match is replaced
   * new ManglerExpression(
   *   "\\.(%s)(\\(|\\{)"
   *   ManglerExpression.matchParserForIndex(1),
   *   ManglerExpression.matchReplacerBy("-%s$2"),
   * );
   *
   * @param patternTemplate The generic pattern (should include only one "%s").
   * @param matchParser The function to use to parse matches.
   * @param matchReplacer The function to use to replace matches.
   * @since v0.1.0
   */
  constructor(
    patternTemplate: string,
    matchParser: MatchParser,
    matchReplacer: MatchReplacer,
  ) {
    this.patternTemplate = patternTemplate;
    this.parseMatch = matchParser;
    this.replaceMatch = matchReplacer;
  }

  /**
   * @inheritdoc
   * @since v0.1.0
   */
  public * exec(s: string, pattern: string): IterableIterator<string> {
    const regExp = this.newRegExp(pattern);
    let match: RegExpExecArray | null = null;
    while ((match = regExp.exec(s)) !== null) {
      const manglerMatch = Match.fromExec(match);
      yield* this.parseMatch(pattern, manglerMatch);
    }
  }

  /**
   * @inheritdoc
   * @since v0.1.0
   */
  public replace(s: string, pattern: string, to: string): string {
    const regexp = this.newRegExp(pattern);
    return s.replace(regexp, (...args: string[]): string => {
      const manglerMatch = Match.fromReplace(args);
      return this.replaceMatch(to, manglerMatch);
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
