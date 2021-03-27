import type { Char, CharSet } from "./characters";

import { ALL_LOWERCASE_CHARS } from "./characters";

/**
 * The {@link NameGenerator} class is a utility class to generate short, safe,
 * and unique strings.
 *
 * @since v0.1.0
 * @version v0.1.17
 */
export default class NameGenerator {
  /**
   * The default set of characters used by {@link @NameGenerator}s.
   *
   * @since v0.1.0
   */
  static readonly DEFAULT_CHARSET: CharSet = ALL_LOWERCASE_CHARS;

  /**
   * The list of reserved names and patterns.
   */
  private readonly reserved: RegExp[];

  /**
   * The set of characters available to generate names with.
   */
  private readonly charSet: Char[];

  /**
   * The last returned name.
   *
   * The value should not be considered defined before {@link
   * NameGenerator.nextName} is called at least once.
   */
  private current = "";

  /**
   * Create a new {@link NameGenerator} that can be used to generate short,
   * safe, and unique strings.
   *
   * The `reserved` parameter can be used to specify strings that should not be
   * generated. Each string is interpreted as a case sensitive Regular
   * Expression that must match exactly. E.g. the reserved string "fa" will be
   * transformed in the Regular Expression `/^fa$/` and hence only prevent the
   * exact string "fa" from being generated. On the other hand, the reserved
   * pattern "fa.*", transformed into `/^fa.*$/`, will prevent any string
   * starting with "fa" (including just "fa") from being generated.
   *
   * If you need to reserve a character that has a special meaning in Regular
   * Expressions you need to escape it. E.g. the reserved string "a\\." will be
   * transformed into `/^a\.$/` and will prevent the exact string "a." from
   * being generated.
   *
   * @param [reserved] One or more reserved names and/or expressions.
   * @param [charSet] A {@link CharSet}.
   * @throws If `charSet` is empty.
   * @since v0.1.0
   * @version v0.1.17
   */
  constructor(
    reserved: Iterable<string> = [],
    charSet: CharSet = NameGenerator.DEFAULT_CHARSET,
  ) {
    const charSetAsArray = Array.from(charSet);
    if (charSetAsArray.length === 0) {
      throw new TypeError("character set cannot be empty");
    }

    this.reserved = Array
      .from(reserved)
      .map((rawExpr) => new RegExp(`^${rawExpr}$`));
    this.charSet = charSetAsArray;
  }

  /**
   * Get the next unique name from the {@link NameGenerator}.
   *
   * @returns The next shortest, safe, and unique string.
   * @since v0.1.0
   * @version v0.1.7
   */
  nextName(): string {
    this.current = this.tick(this.current);
    if (this.isReserved(this.current)) {
      return this.nextName();
    } else {
      return this.current;
    }
  }

  /**
   * Check if a string is reserved in this {@link NameGenerator}.
   *
   * @param s The string of interest.
   * @returns `true` if `s` is reserved, `false` otherwise.
   */
  private isReserved(s: string): boolean {
    return this.reserved.some((expr) => expr.test(s));
  }

  /**
   * Get the next shortest string after the provided string. This may return a
   * string that is reserved in this {@link NameGenerator}.
   *
   * @param s The current string.
   * @returns The next string.
   */
  private tick(s: string): string {
    if (s === "") {
      return this.charSet[0];
    }

    let nextChar = this.charSet[0];
    let tailStr = s.substring(0, s.length - 1);

    const headChar: Char = s.charAt(s.length - 1) as Char;
    if (this.isLastCharInCharset(headChar)) {
      tailStr = this.tick(tailStr);
    } else {
      nextChar = this.getNextChar(headChar);
    }

    return `${tailStr}${nextChar}`;
  }

  /**
   * Check if a given character is the last character in the character set used
   * by this {@link NameGenerator}.
   *
   * @param c The character of interest.
   * @returns `true` if `c` is the last character, `false` otherwise.
   */
  private isLastCharInCharset(c: Char): boolean {
    const lastIndex = this.charSet.length - 1;
    return this.charSet[lastIndex] === c;
  }

  /**
   * Get the next character in the character set used by this {@link
   * NameGenerator}.
   *
   * @param c The character of interest.
   * @returns The character coming after `c` in the character set.
   */
  private getNextChar(c: Char): Char {
    const currentCharIndex = this.charSet.indexOf(c);
    const nextCharIndex = currentCharIndex + 1;
    return this.charSet[nextCharIndex];
  }
}
