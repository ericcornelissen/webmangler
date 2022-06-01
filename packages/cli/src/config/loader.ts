import type { WebManglerCliConfig, WebManglerCliOptions } from "./types";

import { DEFAULT_CONFIG_PATHS, MODULE_NAME } from "./constants";
import { newDefaultConfig } from "./default";

/**
 * A utility to load configuration.
 */
interface Loader {
  /**
   * Load a configuration from a specific file.
   *
   * @param path The path to load from.
   * @returns An object with the configuration, or `null`.
   */
  load(path: string): { config: unknown; isEmpty?: boolean; } | null;

  /**
   * Search for a configuration from a list of configured list of paths.
   *
   * @returns An object with the configuration, or `null`.
   */
  search(): { config: unknown; isEmpty?: boolean; } | null;
}

/**
 * Create a new {@link Loader}.
 *
 * @param moduleName The name of the CLI module.
 * @param options Options for the loader.
 * @returns a {@link Loader}.
 */
type NewLoader = (
  moduleName: string,
  options?: { searchPlaces: string[]; },
) => Loader;

/**
 * Get the configuration at the a specified path.
 *
 * @param loader A {@link Loader}.
 * @param configPath The path o the configuration file.
 * @returns The {@link WebManglerOptions}.
 * @throws If no configuration was found at the specified path.
 */
function loadSpecificConfiguration(
  loader: NewLoader,
  configPath: string,
): WebManglerCliOptions {
  const explorer = loader(MODULE_NAME);

  const result = explorer.load(configPath);
  if (result === null || result.isEmpty === true) {
    throw new Error(`No configuration file found at ${configPath}`);
  }

  return result.config as WebManglerCliOptions;
}

/**
 * Search for configurations at the default configuration paths. If no
 * configuration file is found, the {@Link DEFAULT_CONFIG} is returned.
 *
 * @param loader A {@link Loader}.
 * @returns The {@link WebManglerOptions}.
 */
function searchDefaultPaths(loader: NewLoader): WebManglerCliOptions {
  const explorer = loader(MODULE_NAME, {
    searchPlaces: DEFAULT_CONFIG_PATHS,
  });

  const result = explorer.search();
  if (result === null || result.isEmpty === true) {
    return newDefaultConfig();
  }

  return result.config as WebManglerCliOptions;
}

/**
 * Convert {@link WebManglerCliOptions} into {@link WebManglerCliConfig} by
 * filling in optional options with their defaults (if not present).
 *
 * @param options The {@link WebManglerCliOptions}.
 * @returns The {@link WebManglerCliConfig}.
 */
function convertCliOptionsToConfig(
  options: WebManglerCliOptions,
): WebManglerCliConfig {
  const defaultConfiguration = newDefaultConfig();
  return {
    plugins: options.plugins,
    languages: options.languages,
    reporters: options.reporters || defaultConfiguration.reporters,
  };
}

/**
 * Create a function to get the _WebMangler_ CLI configuration.
 *
 * @param newLoader A {@link NewLoader}.
 * @returns A function to get the _WebMangler_ CLI configuration.
 */
function newGetConfiguration(newLoader: NewLoader) {
  return (configPath?: string): WebManglerCliConfig => {
    const options = (configPath === undefined) ?
      searchDefaultPaths(newLoader) :
      loadSpecificConfiguration(newLoader, configPath);

    return convertCliOptionsToConfig(options);
  };
}

export {
  newGetConfiguration,
};
