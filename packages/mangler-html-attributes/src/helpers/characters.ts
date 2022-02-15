import type { CharSet } from "@webmangler/types";

import {
  ALL_LOWERCASE_CHARS,
  ALL_NUMBER_CHARS,
} from "@webmangler/mangler-utils";

/**
 * Get the character set used by {@link HtmlAttributeMangler}.
 *
 * @returns The character set.
 */
function getCharacterSet(): CharSet {
  return [
    ...ALL_LOWERCASE_CHARS,
    ...ALL_NUMBER_CHARS,
    "-", "_",
  ];
}

export {
  getCharacterSet,
};
