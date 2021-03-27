/**
 * A character is an one of a selection of strings of length one.
 *
 * @since v0.1.7
 */
type Char =
  "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" |
  "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" |
  "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" |
  "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" |
  "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "-" | "_";

/**
 * A character set is a collection of {@link Char}acters.
 *
 * @since v0.1.7
 * @version v0.1.17
 */
type CharSet = Iterable<Char>;

/**
 * A character set ({@link CharSet}) of all lowercase letters.
 *
 * @since v0.1.7
 */
const ALL_LOWERCASE_CHARS: CharSet = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
  "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
];

/**
 * A character set ({@link CharSet}) of all numbers.
 *
 * @since v0.1.7
 */
const ALL_NUMBER_CHARS: CharSet = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
];

/**
 * A character set ({@link CharSet}) of all uppercase letters.
 *
 * @since v0.1.7
 */
const ALL_UPPERCASE_CHARS: CharSet = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
  "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];

/**
 * A character set ({@link CharSet}) of all lowercase an uppercase letters.
 *
 * @since v0.1.11
 */
const ALL_LETTER_CHARS: CharSet = [
  ...ALL_LOWERCASE_CHARS,
  ...ALL_UPPERCASE_CHARS,
];

/**
 * A character set ({@link CharSet}) of all allowed letters.
 *
 * @since v0.1.16
 */
const ALL_CHARS: CharSet = [
  ...ALL_LETTER_CHARS,
  ...ALL_NUMBER_CHARS,
  "-", "_",
];

export {
  ALL_CHARS,
  ALL_LETTER_CHARS,
  ALL_LOWERCASE_CHARS,
  ALL_NUMBER_CHARS,
  ALL_UPPERCASE_CHARS,
};

export type {
  Char,
  CharSet,
};
