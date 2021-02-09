import type { Char } from "./types";

/**
 * The {@link NameGenerator} class is a utility class to generate short, safe,
 * and unique strings.
 *
 * @since v0.1.0
 */
export default class NameGenerator {
  /**
   * The default characters set used by a {@link @NameGenerator}.
   *
   * @since v0.1.0
   */
  static readonly DEFAULT_CHARSET: Char[] = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
    "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
  ];

  /**
   * The list of reserved names.
   */
  private readonly reserved: string[];

  /**
   * The list of characters available to generate names with.
   */
  private readonly charSet: Char[];

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
   * @param reserved A list of reserved names.
   * @param charSet The character set to be used.
   * @since v0.1.0
   */
  constructor(
    reserved: string[] = [],
    charSet: Char[] = NameGenerator.DEFAULT_CHARSET,
  ) {
    this.reserved = reserved;
    this.charSet = charSet;
  }

  /**
   * Get the next unique name from the {@link NameGenerator}.
   *
   * @returns The next shortest, safe, and unique string.
   * @since v0.1.0
   */
  nextName(): string {
    this.current = this.tick(this.current);
    if (this.reserved.includes(this.current)) {
      return this.nextName();
    } else {
      return this.current;
    }
  }

  /**
   * Get the next shortest string after the provided string.
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
