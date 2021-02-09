/**
 * The {@link NameGenerator} class is a utility class to generate short, safe,
 * and unique strings.
 *
 * @since v0.1.0
 */
export default class NameGenerator {
  /**
   * The default set of characters used by {@link @NameGenerator}s.
   *
   * @since v0.1.0
   */
  static readonly CHARSET: string[] = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
    "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
  ];

  /**
   * The list of reserved names and patterns.
   */
  private readonly reserved: RegExp[];

  /**
   * The last returned name.
   *
   * The value should not be considered defined before {@link
   * NameGenerator.nextName} is called.
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
   * pattern "a.*", transformed into `/^a.*$/`, will prevent any string starting
   * with an "a" (including just "a") from being generated.
   *
   * If you need to reserve a character that has a special meaning in Regular
   * Expressions you need to escape it. E.g. the reserved string "a\\." will be
   * transformed into `/^a\.$/` and will prevent the string "a." from being
   * generated.
   *
   * @param reserved A list of reserved names or expressions.
   * @since v0.1.0
   */
  constructor(reserved: string[]=[]) {
    this.reserved = reserved.map((rawExpr) => new RegExp(`^${rawExpr}$`));
  }

  /**
   * Get the next unique name from the {@link NameGenerator}.
   *
   * @returns The next shortest, safe, and unique string.
   * @since v0.1.0
   */
  nextName(): string {
    this.current = NameGenerator.tick(this.current);
    if (this.isReserved(this.current)) {
      return this.nextName();
    } else {
      return this.current;
    }
  }

  /**
   * Check with a string is reserved in the {@link NameGenerator}.
   *
   * @param s The string of interest.
   * @returns `true` if `s` is reserved, `false` otherwise.
   */
  private isReserved(s: string): boolean {
    return this.reserved.some((expr) => expr.test(s));
  }

  /**
   * Get the next shortest string after the provided string.
   *
   * @param s The current string.
   * @returns The next string.
   */
  private static tick(s: string): string {
    if (s === "") {
      return NameGenerator.CHARSET[0];
    }

    let nextChar = NameGenerator.CHARSET[0];
    let tailStr = s.substring(0, s.length - 1);

    const headChar = s.charAt(s.length - 1);
    if (NameGenerator.isLastCharInCharset(headChar)) {
      tailStr = NameGenerator.tick(tailStr);
    } else {
      nextChar = NameGenerator.getNextChar(headChar);
    }

    return `${tailStr}${nextChar}`;
  }

  /**
   * Check if a given character is the last character in the character set used
   * by the {@link NameGenerator}.
   *
   * @param c The character of interest.
   * @returns `true` if `c` is the last character, `false` otherwise.
   */
  private static isLastCharInCharset(c: string): boolean {
    const lastIndex = NameGenerator.CHARSET.length - 1;
    return NameGenerator.CHARSET[lastIndex] === c;
  }

  /**
   * Get the next character in the character set used by {@link NameGenerator}.
   *
   * @param c The character of interest.
   * @returns The character coming after `c` in the character set.
   */
  private static getNextChar(c: string): string {
    const currentCharIndex = NameGenerator.CHARSET.indexOf(c);
    const nextCharIndex = currentCharIndex + 1;
    return NameGenerator.CHARSET[nextCharIndex];
  }
}
