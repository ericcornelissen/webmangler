# Changelog

All notable changes to the _WebMangler Core_ project will be documented in this
file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [Unreleased]

- Fix mangling IDs followed by child, sibling, and adjacent combinators in CSS.
- Fix accidental mangling of some non-id attributes in HTML.

## [0.1.9] - 2021-02-12

- Fix cases where HTML attributes were not mangled due to whitespace.
- Fix mangling multiple HTML attributes on a single HTML element.
- Fix mangling multiple HTML attributes in a single HTML selector in JavaScript.
- Fix mangling HTML attributes when `>` appears in an attribute value.
- Support mangling HTML attribute usage (with `attr(data-foo)`) in CSS.
- Support mangling attribute-value selectors in JavaScript.
- Improve HTML attribute mangler performance on JavaScript.

## [0.1.8] - 2021-02-12

- Prevent CSS class mangler from generating classes with a leading number.
- Rename built-in languages export from `webmangler/languages`.

## [0.1.7] - 2021-02-10

- Allow reserved strings to be Regular Expressions.
- Allow for mangling with custom character sets.
- Export all mangler plugins from `webmangler/manglers`.
- Export all language plugins from `webmangler/languages`.
- Fix bug where the prefix could not be omitted with the HTML attribute mangler.
- Improve character set used by all built-in manglers.

## [0.1.6] - 2021-02-09

- Don't publish empty `types.js` files.
- Define `webmangler` in terms of files extending `ManglerFile`.

## [0.1.5] - 2021-02-07

- Increase performance of CSS variable mangling.
- Fix cases where CSS variables were not mangled due to whitespace.
- Prevent unintended changes to whitespace with CSS variable mangling.
- Support mangling CSS variable usage (with `var(--foo)`) in HTML.
- Support fallback syntax (`var(name, fallback)`) when mangling CSS variables.

## [0.1.4] - 2021-02-02

- Publish from root rather than `./lib`.
- Remove mocks and tests accidentally published.

## [0.1.3] - 2021-01-30

- Add default options for `RecommendedManglers` and `BuiltInManglers`.
- Update exported type declarations.

## [0.1.2] - 2021-01-27

- Add missing type declarations.

## [0.1.1] - 2021-01-27

- Update exported type declarations.

## [0.1.0] - 2021-01-27

- Initial release with 4 built-in manglers and 3 built-in supported languages.

[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html
