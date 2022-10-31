/**
 * A character is one of a selection of strings of length one.
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

export type {
  Char,
  CharSet,
};
