import type { WebManglerOptions } from "webmangler";

import BuiltInLanguages from "webmangler/languages/builtin";
import RecommendManglers from "webmangler/manglers/recommended";

/**
 * The default configuration for _WebMangler_ used by the _WebMangler_ CLI.
 *
 * @since v0.1.0
 */
export const DEFAULT_CONFIG: WebManglerOptions = {
  plugins: [
    new RecommendManglers(),
  ],
  languages: [
    new BuiltInLanguages(),
  ],
};
