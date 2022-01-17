import type { WebManglerOptions } from "@webmangler/types";

import { BuiltInLanguagesSupport } from "webmangler/languages";
import { RecommendedManglers } from "webmangler/manglers";

/**
 * The default configuration for _WebMangler_ used by the _WebMangler_ CLI.
 *
 * @returns The default {@link WebManglerOptions}.
 * @since v0.1.0
 * @version v0.1.7
 */
function newDefaultConfig(): WebManglerOptions {
  return {
    plugins: [
      new RecommendedManglers(),
    ],
    languages: [
      new BuiltInLanguagesSupport(),
    ],
  };
}

export {
  newDefaultConfig,
};
