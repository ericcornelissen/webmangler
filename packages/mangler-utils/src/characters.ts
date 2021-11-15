import type { CharSet } from "@webmangler/types";

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
 * A character set ({@link CharSet}) of all numeric characters.
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
 * A character set ({@link CharSet}) of all lowercase and uppercase letters.
 *
 * @since v0.1.11
 */
const ALL_LETTER_CHARS: CharSet = [
  ...ALL_LOWERCASE_CHARS,
  ...ALL_UPPERCASE_CHARS,
];

/**
 * A character set ({@link CharSet}) of all lowercase letters, uppercase
 * letters, and numeric characters.
 *
 * @since v0.1.26
 */
const ALL_ALPHANUMERIC_CHARS: CharSet = [
  ...ALL_LETTER_CHARS,
  ...ALL_NUMBER_CHARS,
];

/**
 * A character set ({@link CharSet}) of all allowed characters.
 *
 * @since v0.1.16
 * @deprecated Use `ALL_ALPHANUMERIC_CHARS` instead and add symbols manually.
 */
const ALL_CHARS: CharSet = [
  ...ALL_LETTER_CHARS,
  ...ALL_NUMBER_CHARS,
  "-", "_",
];

export {
  ALL_ALPHANUMERIC_CHARS,
  ALL_CHARS,
  ALL_LETTER_CHARS,
  ALL_LOWERCASE_CHARS,
  ALL_NUMBER_CHARS,
  ALL_UPPERCASE_CHARS,
};
