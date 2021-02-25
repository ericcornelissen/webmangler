import type { WebManglerOptions } from "webmangler";

import { cosmiconfigSync } from "cosmiconfig";

import { DEFAULT_CONFIG_PATHS, MODULE_NAME } from "./constants";
import { DEFAULT_CONFIG } from "./default";

/**
 * Get the configuration at the a specified path.
 *
 * @param configPath The path o the configuration file.
 * @returns The {@link WebManglerOptions}.
 * @throws If no configuration was found at the specified path.
 */
function loadSpecificConfiguration(configPath: string): WebManglerOptions {
  const explorer = cosmiconfigSync(MODULE_NAME);

  const result = explorer.load(configPath);
  if (result === null || result.isEmpty === true) {
    throw new Error(`No configuration file found at ${configPath}`);
  }

  return result.config as WebManglerOptions;
}

/**
 * Search for configurations at the default configuration paths. If no
 * configuration file is found, the {@Link DEFAULT_CONFIG} is returned.
 *
 * @returns The {@link WebManglerOptions}.
 */
function searchDefaultPaths(): WebManglerOptions {
  const explorer = cosmiconfigSync(MODULE_NAME, {
    searchPlaces: DEFAULT_CONFIG_PATHS,
  });

  const result = explorer.search();
  if (result === null || result.isEmpty === true) {
    return DEFAULT_CONFIG;
  }

  return result.config as WebManglerOptions;
}

/**
 * Get the _WebMangler_ CLI configuration. Either at a specified path, or if
 * that is `undefined`, from one of {@link DEFAULT_CONFIG_PATHS}, or if those
 * don't exist, {@link DEFAULT_CONFIG}.
 *
 * @param configPath The path o the configuration file.
 * @returns The {@link WebManglerOptions}.
 * @throws If `configPath` was provided but no configuration was found.
 */
export function getConfiguration(
  configPath: string | undefined,
): WebManglerOptions {
  if (configPath !== undefined) {
    return loadSpecificConfiguration(configPath);
  } else {
    return searchDefaultPaths();
  }
}


