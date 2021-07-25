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
 * A character set ({@link CharSet}) of all numbers.
 *
 * @since v0.1.7
 */
const ALL_NUMBER_CHARS: CharSet = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
];

export {
  ALL_LOWERCASE_CHARS,
  ALL_NUMBER_CHARS,
};
