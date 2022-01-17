import { cosmiconfigSync } from "cosmiconfig";

import { newGetConfiguration } from "./loader";

/**
 * Get the _WebMangler_ CLI configuration. Either at a specified path, or if
 * that is `undefined`, from one of {@link DEFAULT_CONFIG_PATHS}, or if those
 * don't exist, {@link DEFAULT_CONFIG}.
 *
 * @param configPath The path o the configuration file.
 * @returns The {@link WebManglerOptions}.
 * @throws If `configPath` was provided but no configuration was found.
 */
const getConfiguration = newGetConfiguration(
  cosmiconfigSync,
);

export default getConfiguration;
