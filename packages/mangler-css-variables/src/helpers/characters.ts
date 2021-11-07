import type { CharSet } from "@webmangler/types";

import { ALL_LETTER_CHARS, ALL_NUMBER_CHARS } from "@webmangler/mangler-utils";

/**
 * Get the character set used by {@link CssVariableMangler}.
 *
 * @returns The character set.
 */
function getCharacterSet(): CharSet {
  return [
    ...ALL_LETTER_CHARS,
    ...ALL_NUMBER_CHARS,
    "-", "_",
  ];
}

export {
  getCharacterSet,
};
