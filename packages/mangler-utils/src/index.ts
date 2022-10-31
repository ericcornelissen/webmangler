import type { SimpleManglerOptions } from "./simple-mangler.class";

import {
  ALL_ALPHANUMERIC_CHARS,
  ALL_LETTER_CHARS,
  ALL_LOWERCASE_CHARS,
  ALL_NUMBER_CHARS,
  ALL_UPPERCASE_CHARS,
} from "./characters";
import { toArrayIfNeeded } from "./helpers";
import initMultiManglerPlugin from "./multi-mangler.class";
import initSimpleManglerPlugin from "./simple-mangler.class";

/**
 * The {@link MultiManglerPlugin} abstract class is a utility to create a
 * {@link WebManglerPlugin} that provides multiple manglers in one plugin.
 *
 * @since v0.1.0
 * @version v0.1.28
 */
const MultiManglerPlugin = initMultiManglerPlugin({
  toArrayIfNeeded,
});

/**
 * The {@link SimpleManglerPlugin} abstract class provides an implementation of
 * a {@link WebManglerPlugin} that deals with implementing the API if it is
 * provided with the appropriate data.
 *
 * It is recommended to extend this class - or {@link MultiManglerPlugin},
 * depending on your needs - if you're implementing a {@link WebManglerPlugin}.
 *
 * @since v0.1.0
 * @version v0.1.28
 */
const SimpleManglerPlugin = initSimpleManglerPlugin({
  // SimpleManglerPlugin has no dependencies
});

export {
  ALL_ALPHANUMERIC_CHARS,
  ALL_LETTER_CHARS,
  ALL_LOWERCASE_CHARS,
  ALL_NUMBER_CHARS,
  ALL_UPPERCASE_CHARS,
  MultiManglerPlugin,
  SimpleManglerPlugin,
};

export type {
  SimpleManglerOptions,
};
