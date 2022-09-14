import type { CharSet } from "@webmangler/types";

/**
 * The {@link CharSet} used to generate unique identifiers for embed locations.
 */
const idCharSet: CharSet = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
  "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D",
  "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
  "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7",
  "8", "9",
];

/**
 * The prefix for all WebMangler embed identifiers.
 */
const idPrefix = "wm-embed@";

export {
  idCharSet,
  idPrefix,
};
