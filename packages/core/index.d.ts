/**
 * Type defining the information required by _WebMangler_ about files.
 *
 * NOTE: The _WebMangler_ core **will not** read or write files for you.
 */
declare interface ManglerFile {
  /**
   * The contents of the file as a string.
   *
   * @since v0.1.0
   */
  content: string;

  /**
   * The type of file, e.g. "js" or "html".
   *
   * This can typically be obtained by looking at the extension of the file.
   *
   * @since v0.1.0
   */
  readonly type: string;
}

/**
 * Type defining the available options for _WebMangler_.
 *
 * @since v0.1.0
 */
declare interface WebManglerOptions {
  /**
   * The plugins to be used by the _WebMangler_.
   *
   * @since v0.1.0
   */
  plugins: WebManglerPlugin[];

  /**
   * The plugins of language to support.
   *
   * @since v0.1.0
   */
  languages: WebManglerLanguagePlugin[];
}

/**
 * The interface that every plugin for _WebMangler_ must implement.
 *
 * @since v0.1.0
 */
declare interface WebManglerPlugin {
  /**
   * Mangle a set of `files` with this {@link WebManglerPlugin}.
   *
   * It is recommended for the plugin to use the `mangleEngine` to do the
   * mangling.
   *
   * @param mangleEngine The _WebMangler_ core mangling engine.
   * @param files The files to be mangled.
   * @returns The mangled files.
   * @since v0.1.0
   */
  mangle(mangleEngine: MangleEngine, files: ManglerFile[]): ManglerFile[];

  /**
   * Instruct the {@link WebManglerPlugin} to use the {@link ManglerExpression}s
   * specified by a {@link WebManglerLanguagePlugin}.
   *
   * @param languagePlugin The {@link WebManglerLanguagePlugin} to be used.
   * @since v0.1.0
   */
  use(languagePlugin: WebManglerLanguagePlugin): void;
}

/**
 * The interface that every language plugin for _WebMangler_ must implement.
 *
 * @since v0.1.0
 */
declare interface WebManglerLanguagePlugin {
  /**
   * Get {@link ManglerExpression}s for one or more languages for a {@link
   * WebManglerPlugin}.
   *
   * If the {@link WebManglerLanguagePlugin} supports multiple languages it may
   * return a {@link ManglerExpressions} instance for each language.
   *
   * If the {@link WebManglerLanguagePlugin} does not provide support for the
   * {@link WebManglerPlugin} it should return zero {@link ManglerExpression}s.
   *
   * @param pluginId The identifier of the {@link WebManglerPlugin}.
   * @returns The {@link ManglerExpression}s for the plugin for the language(s).
   * @since v0.1.0
   */
  getExpressionsFor(pluginId: string): ManglerExpressions[];
}

/**
 * Type defining a {@link MangleEngine}, which is a function that performs the
 * search-and-replace part of mangling.
 *
 * NOTE: a {@link MangleEngine} may return fewer files that it was provided
 * with.
 *
 * @param files The files that should be mangled.
 * @param expressions The {@link ManglerExpression}s to find strings to mangle.
 * @param patterns The patterns of string to be mangled.
 * @param options The configuration for mangling.
 * @returns The mangled files.
 * @since v0.1.0
 */
declare type MangleEngine = (
  files: ManglerFile[],
  expressions: Map<string, ManglerExpression[]>,
  patterns: string | string[],
  options: MangleEngineOptions,
) => ManglerFile[];

/**
 * A set of generic options used by the {@link MangleEngine} for mangling.
 *
 * @since v0.1.0
 */
declare interface MangleEngineOptions {
  /**
   * The prefix to use for mangled strings.
   *
   * @default `""`
   * @since v0.1.0
   */
  manglePrefix?: string;

  /**
   * A list of names not to be used as mangled string.
   *
   * @default `[]`
   * @since v0.1.0
   */
  reservedNames?: string[];
}

/* --- Built-in plugins --- */

/**
 * The options for _WebMangler_'s built-in CSS class mangler.
 *
 * @since v0.1.0
 */
declare interface CssClassManglerOptions {
  /**
   * One or more patterns for CSS classes that should be mangled.
   *
   * @default `"cls-[a-zA-Z-_]+"`
   * @since v0.1.0
   */
  classNamePattern?: string | string[];

  /**
   * A list of CSS class names that should not be used.
   *
   * @default `[]`
   * @since v0.1.0
   */
  reservedClassNames?: string[];

  /**
   * A prefix to use for mangled CSS classes.
   *
   * @default `""`
   * @since v0.1.0
   */
  keepClassNamePrefix?: string;
}

/**
 * The options for _WebMangler_'s built-in CSS variables mangler.
 *
 * @since v0.1.0
 */
declare interface CssVariableManglerOptions {
  /**
   * One or more patterns for CSS variables that should be mangled.
   *
   * @default `"[a-zA-Z-]+"`
   * @since v0.1.0
   */
  cssVarNamePattern?: string | string[];

  /**
   * A list of CSS variable names that should not be used.
   *
   * @default `[]`
   * @since v0.1.0
   */
  reservedCssVarNames?: string[];

  /**
   * A prefix to use for mangled CSS variables.
   *
   * @default `""`
   * @since v0.1.0
   */
  keepCssVarPrefix?: string;
}

/**
 * The options for _WebMangler_'s built-in HTML Attributes mangler.
 *
 * @since v0.1.0
 */
declare interface HtmlAttributeManglerOptions {
  /**
   * One or more patterns for HTML attributes that should be mangled.
   *
   * The most common value for this option is: `'data-[a-z-]+'`,  which will
   * mangle all `data-` attributes.
   *
   * @default `"data-[a-z-]+"`
   * @since v0.1.0
   */
  attrNamePattern?: string | string[];

  /**
   * A list of HTML attribute names that should not be used.
   *
   * @default `[]`
   * @since v0.1.0
   */
  reservedAttrNames?: string[];

  /**
   * A prefix to use for mangled HTML attributes. Set to `''` if no prefix
   * should be used for mangled HTML attributes.
   *
   * The most common value for this option is: `'data-`, which will keep the
   * prefix of 'data-' attributes.
   *
   * @default `"data-"`
   * @since v0.1.0
   */
  keepAttrPrefix?: string;
}

/**
 * The options for _WebMangler_'s built-in HTML IDs mangler.
 *
 * @since v0.1.0
 */
declare interface HtmlIdManglerOptions {
  /**
   * One or more patterns for IDs that should be mangled.
   *
   * @default `"id-[a-zA-Z-_]+"`
   * @since v0.1.0
   */
  idNamePattern?: string | string[];

  /**
   * A list of IDs that should not be used.
   *
   * @default `[]`
   * @since v0.1.0
   */
  reservedIds?: string[];

  /**
   * A prefix to use for mangled IDs.
   *
   * @default `""`
   * @since v0.1.0
   */
  keepIdPrefix?: string;
}

/**
 * The configuration of the {@link RecommendedManglers}.
 *
 * To disable any individual mangler the `pattern` option of that mangler can be
 * set to `undefined`.
 *
 * @since v0.1.0
 */
declare interface RecommendedManglersOptions extends
    CssClassManglerOptions,
    CssVariableManglerOptions,
    HtmlAttributeManglerOptions {
  /**
   * Disable the {@see CssClassMangler}.
   *
   * @since v0.1.0
   */
  disableCssClassMangling?: boolean;

  /**
   * Disable the {@see CssVariableMangler}.
   *
   * @since v0.1.0
   */
  disableCssVarMangling?: boolean;

  /**
   * Disable the {@see HtmlAttributeMangler}.
   *
   * @since v0.1.0
   */
  disableHtmlAttrMangling?: boolean;
}

/**
 * The configuration of the {@link BuiltInManglers}.
 *
 * To disable any individual mangler the `pattern` option of that mangler can be
 * set to `undefined`.
 *
 * @since v0.1.0
 */
declare interface BuiltInManglersOptions extends
    CssClassManglerOptions,
    CssVariableManglerOptions,
    HtmlAttributeManglerOptions,
    HtmlIdManglerOptions {
  /**
   * Disable the {@see CssClassMangler}.
   *
   * @since v0.1.0
   */
  disableCssClassMangling?: boolean;

  /**
   * Disable the {@see CssVariableMangler}.
   *
   * @since v0.1.0
   */
  disableCssVarMangling?: boolean;

  /**
   * Disable the {@see HtmlAttributeMangler}.
   *
   * @since v0.1.0
   */
  disableHtmlAttrMangling?: boolean;

  /**
   * Disable the {@see HtmlIdMangler}.
   *
   * @since v0.1.0
   */
  disableHtmlIdMangling?: boolean;
}

/* --- For plugin authors --- */

/**
 * Interface representing a regular expression-like object that can be used to
 * find and replace patterns by _WebMangler_.
 *
 * @since v0.1.0
 */
declare interface ManglerExpression {
  /**
   * Execute the {@link ManglerExpression} on a string for a given pattern.
   *
   * @param s The string to execute the expression on.
   * @param pattern The pattern to execute the expression with.
   * @returns The matched substrings in `s`.
   * @since v0.1.0
   */
  exec(s: string, pattern: string): Iterable<string>;

  /**
   * Replace patterns in a string by other strings.
   *
   * @param s The string to replace in.
   * @param original The string/pattern to replace.
   * @param replacement The string/pattern to replace `original` by.
   * @returns The string with the patterns replaced.
   * @since v0.1.0
   */
  replace(s: string, original: string, replacement: string): string;
}

/**
 * Interface wrapping one ore more {@link ManglerExpression}s for a specific
 * language.
 *
 * @since v0.1.0
 */
declare interface ManglerExpressions {
  /**
   * The language for which the `expressions` are.
   *
   * @since v0.1.0
   */
  language: string;

  /**
   * The {@link ManglerExpression}s for the `language`.
   *
   * @since v0.1.0
   */
  expressions: ManglerExpression[];
}

/**
 * Interface representing a match found by a {@link ManglerExpression}.
 *
 * @since v0.1.0
 */
declare interface ManglerMatch {
  /**
   * Get the full string that was matched.
   *
   * @returns The full string that was matched.
   * @since v0.1.0
   */
  getMatchedStr(): string;

  /**
   * Get the value of a captured group
   *
   * @param index The index of the captured group (starting at 0).
   * @returns The value of group `index`, or `""` if no such group exists.
   * @since v0.1.0
   */
  getGroup(index: number): string;

  /**
   * Get the value of a captured group
   *
   * @param name The name of the captured group.
   * @returns The value of group `name`, or `""` if no such group exists.
   * @since v0.1.0
   */
  getNamedGroup(name: string): string;
}
