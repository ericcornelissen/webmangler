import type { WebManglerCliConfig } from "./types";

import { BuiltInLanguagesSupport } from "webmangler/languages";
import { RecommendedManglers } from "webmangler/manglers";

/**
 * The default configuration for _WebMangler_ used by the _WebMangler_ CLI.
 *
 * @returns The default {@link WebManglerOptions}.
 * @since v0.1.0
 * @version v0.1.8
 */
function newDefaultConfig(): WebManglerCliConfig {
  return {
    plugins: [
      new RecommendedManglers(),
    ],
    languages: [
      new BuiltInLanguagesSupport(),
    ],
    reporters: [
      // TODO: Add at least one default reporter
    ],
  };
}

export {
  newDefaultConfig,
};
