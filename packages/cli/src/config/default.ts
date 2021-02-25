import type { WebManglerOptions } from "webmangler";

import { BuiltInLanguagesSupport } from "webmangler/languages";
import { RecommendedManglers } from "webmangler/manglers";

/**
 * The default configuration for _WebMangler_ used by the _WebMangler_ CLI.
 *
 * @since v0.1.0
 * @version v0.1.4
 */
export const DEFAULT_CONFIG: WebManglerOptions = {
  plugins: [
    new RecommendedManglers(),
  ],
  languages: [
    new BuiltInLanguagesSupport(),
  ],
};
