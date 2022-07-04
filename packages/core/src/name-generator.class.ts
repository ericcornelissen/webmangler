import type { Char, CharSet } from "@webmangler/types";

/**
 * The options for a {@link NameGenerator}.
 *
 * @since v0.1.24
 * @version v0.1.26
 */
interface NameGeneratorOptions {
  /**
   * One or more reserved names and/or expressions for the
   * {@link NameGenerator}.
   *
   * @since v0.1.0
   * @version v0.1.26
   */
  readonly reservedNames?: Iterable<string>;

  /**
   * The {@link CharSet} to be used by the {@link NameGenerator}.
   *
   * @since v0.1.7
   * @version v0.1.26
   */
  readonly charSet: CharSet;
}

/**
 * The {@link NameGenerator} class is a utility class to generate short, safe,
 * and unique strings.
 *
 * @since v0.1.0
 * @version v0.1.26
 */
class NameGenerator {
  /**
   * The list of reserved names and patterns.
   */
  private readonly reserved: RegExp[];

  /**
   * The list of characters available to generate names with.
   */
  private readonly charList: Char[];

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
   * If `charSet` contains duplicates those will be removed so that no duplicate
   * names are generated.
   *
   * @param [options] The {@link NameGeneratorOptions}.
   * @throws If `options.charSet` is empty.
   * @since v0.1.0
   * @version v0.1.24
   */
  constructor(options: NameGeneratorOptions) {
    const reserved = options.reservedNames || [];
    const charSet = options.charSet;

    const charSetNoDuplicates = new Set(charSet);
    if (charSetNoDuplicates.size === 0) {
      throw new TypeError("character set cannot be empty");
    }

    this.reserved = Array
      .from(reserved)
      .map((rawExpr) => new RegExp(`^${rawExpr}$`));
    this.charList = Array.from(charSetNoDuplicates);
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
    let nextChar = this.charList[0];
    let tailStr = s.substring(0, s.length - 1);

    const headChar: Char = s.charAt(s.length - 1) as Char;
    if (this.isLastChar(headChar)) {
      tailStr = this.tick(tailStr);
    } else {
      nextChar = this.getNextChar(headChar);
    }

    return `${tailStr}${nextChar}`;
  }

  /**
   * Check if a given character is the last character in the character list used
   * by this {@link NameGenerator}.
   *
   * @param c The character of interest.
   * @returns `true` if `c` is the last character, `false` otherwise.
   */
  private isLastChar(c: Char): boolean {
    const lastIndex = this.charList.length - 1;
    return this.charList[lastIndex] === c;
  }

  /**
   * Get the next character in the character list used by this {@link
   * NameGenerator}.
   *
   * @param c The character of interest.
   * @returns The character coming after `c` in the character list.
   */
  private getNextChar(c: Char): Char {
    const currentCharIndex = this.charList.indexOf(c);
    const nextCharIndex = currentCharIndex + 1;
    return this.charList[nextCharIndex];
  }
}

export default NameGenerator;
