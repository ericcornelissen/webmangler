/**
 * Load a JavaScript configuration file.
 *
 * NOTE: this function assumes the configuration file exists.
 *
 * @param configFilePath The configuration file's path.
 * @returns The configuration defined in `configFilePath`.
 * @since v0.1.0
 */
export default function loadJsConfig(configFilePath: string): unknown {
  // We want to dynamically import the configuration file, so we disable:
  //   eslint-disable-next-line max-len
  //   eslint-disable-next-line @typescript-eslint/no-var-requires, security/detect-non-literal-require
  const config = require(configFilePath);
  return config;
}
