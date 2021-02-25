# Changelog

All notable changes to the _WebMangler Core_ project will be documented in this
file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [Unreleased]

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

[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html
