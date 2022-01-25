/**
 * The default _WebMangler_ CLI configuration files.
 *
 * @since v0.1.0
 */
const DEFAULT_CONFIG_PATHS: string[] = [
  // ".webmanglerrc.json", JSON not yet supported
  // ".webmanglerrc.yml", YAML not yet supported
  ".webmanglerrc.js",
  "webmangler.config.js",
];

/**
 * Module name used by cosmiconfig.
 * See {@link https://www.npmjs.com/package/cosmiconfig#modulename}.
 *
 * @since v0.1.4
 */
const MODULE_NAME = "webmangler";

export {
  DEFAULT_CONFIG_PATHS,
  MODULE_NAME,
};
