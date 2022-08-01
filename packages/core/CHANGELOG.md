# Changelog

All notable changes to the _WebMangler Core_ project will be documented in this
file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [Unreleased]

- Add support for detecting embeds inside of embeds. ([#341], [#344])

## [0.1.26] - 2022-07-02

- BREAKING: Change `Iterable` on API to `Collection`. ([#306])
- BREAKING: Require plugins to specify a character set. ([#274])
- Add missing direct dependencies. ([#264])
- Improve performance by removing useless conversions. ([#275])

## [0.1.25] - 2022-01-29

- BREAKING: Update the return type of the main `webmangler` function. ([#244])

## [0.1.24] - 2021-08-22

- Extract built-in language plugins into dependencies.
- Extract built-in mangler plugins into dependencies.

## [0.1.23] - 2021-07-07

- Add support for ignore patterns to all built-in manglers.
- Fix ignored options in `BuiltInManglers` and `RecommendedManglers`.
- Fix mangling of CSS values inside CSS functions.
- Fix performance issues related to embeds.
- Fix unintentional mangling in HTML attributes.

## [0.1.22] - 2021-06-15

- Fix counting errors of attributes in HTML to improve compression.
- Fix incorrect handling of missing groups in `NestedGroupMangleExpression`.
- Fix mangling of query selectors without prefix.
- Fix mangling in HTML after valueless attributes.
- Fix unintentional mangling in HTML content.
- Fix unintentional mangling in JavaScript line comments.
- Fix various bugs due to comments in all language plugins.

## [0.1.21] - 2021-05-30

- Add support for mangling CSS embedded in HTML.
- Add support for mangling JavaScript embedded in HTML.
- Fix mangling CSS values when `!important` is used.
- Fix mangling CSS properties, values, and selectors when comments are used.
- Prevent mangling in CSS, HTML, and JavaScript comments and strings.

## [0.1.20] - 2021-05-13

- Add option to ignore strings to `SingleGroupMangleExpression`.
- Fix mangling query selectors in nested CSS selectors.
- Fix unintended mangling of some query selectors.

## [0.1.19] - 2021-04-30

- Fix incorrect counting of certain mangled values in JS to improve compression.
- Fix mangling CSS variables in multi-value CSS values.
- Fix mangling HTML attributes in multi-value CSS values.
- Fix mangling unquoted IDs in certain edge cases.
- Support mangling CSS classes when attribute value is not quoted.
- Support mangling CSS variables when the style attribute value is not quoted.
- Support mangling attribute usage when the style attribute value is not quoted.

## [0.1.18] - 2021-04-17

- Fix accidental mangling in HTML content.
- Fix various cases where attributes in HTML would not be mangled.
- Improve performance of the built-in CSS language plugin.
- Improve performance of the built-in JavaScript language plugin.
- Support mangling attributes selectors with unquoted values.

## [0.1.17] - 2021-03-31

- Generalize interfaces to allow for other iterable types than arrays.
- Prevent duplicate mangled names when mangling.
- Support configuring languages in built-in language plugins.
- Support mangling attributes in `attr()` in HTML style attribute values.
- All inputted files will now always be returned, even if not mangled.

## [0.1.16] - 2021-03-19

- Add README with basic documentation.
- Add helper to get file type from a file path.
- Include `LICENSE` in published package.
- Support mangling classes in user-specified attributes.
- Support mangling IDs in unquoted attribute.

## [0.1.15] - 2021-03-11

- Fix unwanted mangling of IDs in external URIs.
- Fix mangling of IDs in URLs with query parameters.
- Support mangling IDs in user-specified attributes.
- Support mangling IDs in URIs in user-specified attributes.

## [0.1.14] - 2021-03-03

- Improve mangling performance.

## [0.1.13] - 2021-02-25

- Fix accidental mangling of CSS variable-like strings in CSS.
- Fix accidental mangling of HTML attribute-like strings in CSS.
- Support mangling IDs in the HTML `for` attribute.

## [0.1.12] - 2021-02-19

- Fix accidental mangling of class-like strings in CSS.
- Fix accidental mangling of id-like strings in CSS.
- Fix accidental mangling of values of HTML attributes with the suffix "class".
- Fix accidental mangling of values of HTML attributes with the suffix "href".
- Fix accidental mangling of values of HTML attributes with the suffix "style".
- Fix cases where classes would not be mangled in JavaScript
- Improve the performance of the built-in CSS class mangler.
- Improve the performance of the built-in HTML attribute mangler.

## [0.1.11] - 2021-02-18

- Improve the performance of the built-in ID mangler.

## [0.1.10] - 2021-02-14

- Allow ID mangling in complex query selectors in JavaScript.
- Fix accidental mangling of some non-id attributes in HTML.
- Fix mangling IDs followed by child, sibling, and adjacent combinators in CSS.
- Fix _Maximum call stack size exceeded_ error by the HTML Attribute mangler.
- Improve the performance of the HTML ID mangler on JavaScript.
- Support mangling IDs in CSS attribute selectors using `href`.

## [0.1.9] - 2021-02-12

- Fix cases where HTML attributes were not mangled due to whitespace.
- Fix mangling multiple HTML attributes on a single HTML element.
- Fix mangling multiple HTML attributes in one query selector in JavaScript.
- Fix mangling HTML attributes when `>` appears in an attribute value.
- Improve the performance of the HTML attributes mangler on JavaScript.
- Support mangling HTML attribute usage (with `attr(data-foo)`) in CSS.
- Support mangling attribute value selectors in JavaScript.

## [0.1.8] - 2021-02-12

- Prevent CSS class mangler from generating classes with a leading number.
- Rename built-in languages exported from `webmangler/languages`.

## [0.1.7] - 2021-02-10

- Allow _WebMangler_ plugins to use custom character sets.
- Allow reserved strings to be Regular Expressions.
- Export all mangler plugins from `webmangler/manglers`.
- Export all language plugins from `webmangler/languages`.
- Fix bug where the prefix could not be omitted when mangling HTML attributes.
- Improve character set used by all built-in manglers.

## [0.1.6] - 2021-02-09

- Define `webmangler` in terms of files extending `ManglerFile`.
- Don't publish empty `types.js` files.

## [0.1.5] - 2021-02-07

- Fix cases where CSS variables were not mangled due to whitespace.
- Improve the performance of the CSS variable mangler on JavaScript.
- Prevent unintended changes to whitespace with CSS variable mangling.
- Support fallback syntax (`var(name, fallback)`) when mangling CSS variables.
- Support mangling CSS variable usage (with `var(--foo)`) in HTML.

## [0.1.4] - 2021-02-02

- Prevent mocks and tests from being published.
- Publish from root rather than `./lib`.

## [0.1.3] - 2021-01-30

- Add default options for `RecommendedManglers` and `BuiltInManglers`.
- Update exported type declarations.

## [0.1.0] - 2021-01-27

- Initial release with 4 built-in manglers and 3 built-in supported languages.

[#244]: https://github.com/ericcornelissen/webmangler/pull/244
[#264]: https://github.com/ericcornelissen/webmangler/pull/264
[#274]: https://github.com/ericcornelissen/webmangler/pull/274
[#275]: https://github.com/ericcornelissen/webmangler/pull/275
[#306]: https://github.com/ericcornelissen/webmangler/pull/306
[#341]: https://github.com/ericcornelissen/webmangler/pull/341
[#344]: https://github.com/ericcornelissen/webmangler/pull/344
[keep a changelog]: https://keepachangelog.com/en/1.0.0/ "Keep a CHANGELOG"
[semantic versioning]: https://semver.org/spec/v2.0.0.html "Semantic versioning"
