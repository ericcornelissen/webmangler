# Changelog

All notable changes to the _WebMangler Language Utilities_ project will be
documented in this file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [Unreleased]

- BREAKING: Drop support for generators from `MultiLanguagePlugin`. ([#332])
- BREAKING: Force readonly file contents in `EmbedsGetter` type. ([#332])

## [0.1.27] - 2022-06-29

- Update `patternTemplate` format for mangle expressions. ([#258])
- Update interface of `SimpleLanguagePlugin`. ([#310])

## [0.1.26] - 2022-01-29

- BREAKING: Drop deprecated `MangleExpression` constructors. ([#243])
- Support more top-level matching patterns in `NestedMangleExpression`. ([#246])
- Use `ReadonlyMap` in all `MangleExpression` and `WebManglerLanguagePlugin`
  implementations. ([#248])

## [0.1.25] - 2022-01-15

- Improve performance of `MultiLanguagePlugin` for many languages. ([#236])
- Update interface of `MangleExpression` utilities. ([#211])

## [0.1.24] - 2021-11-29

- Add option to control case sensitivity to mangle-expression helpers. ([#191])

## [0.1.23] - 2021-07-15

- Extract _Webmangler Core_ language utils into this package. ([#136])

[#136]: https://github.com/ericcornelissen/webmangler/pull/136
[#191]: https://github.com/ericcornelissen/webmangler/pull/191
[#211]: https://github.com/ericcornelissen/webmangler/pull/211
[#236]: https://github.com/ericcornelissen/webmangler/pull/236
[#243]: https://github.com/ericcornelissen/webmangler/pull/243
[#246]: https://github.com/ericcornelissen/webmangler/pull/246
[#248]: https://github.com/ericcornelissen/webmangler/pull/248
[#258]: https://github.com/ericcornelissen/webmangler/pull/258
[#310]: https://github.com/ericcornelissen/webmangler/pull/310
[#332]: https://github.com/ericcornelissen/webmangler/pull/332
[keep a changelog]: https://keepachangelog.com/en/1.0.0/ "Keep a CHANGELOG"
[semantic versioning]: https://semver.org/spec/v2.0.0.html "Semantic versioning"
