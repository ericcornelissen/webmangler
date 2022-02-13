# Changelog

All notable changes to the _WebMangler Language CSS_ project will be documented
in this file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [Unreleased]

- _No changes yet_

## [0.1.28] - 2022-01-29

- Add support for mangling multi-value attributes. ([#242])
- Bump minimum `@webmangler/language-utils` version to `^0.1.26`. ([#250])

## [0.1.27] - 2022-01-08

- Fix unintentional mangling in comments with newlines. ([#226])

## [0.1.26] - 2021-10-04

- Fix bug where some selectors in media query would not be recognized. ([#173])

## [0.1.25] - 2021-08-23

- Fix issue where large chunks of CSS would not be recognized. ([#156])

## [0.1.24] - 2021-08-23

- Fix CSS value detection bug due to unexpected characters in comments. ([#138])
- Fix unintentional mangling in comments. ([#143])
- Fix unintentional mangling in strings. ([#151])

## [0.1.23] - 2021-07-15

- Extract the _Webmangler Core_ CSS language plugin into this package. ([#136])

[#136]: https://github.com/ericcornelissen/webmangler/pull/136
[#138]: https://github.com/ericcornelissen/webmangler/pull/138
[#143]: https://github.com/ericcornelissen/webmangler/pull/143
[#151]: https://github.com/ericcornelissen/webmangler/pull/151
[#156]: https://github.com/ericcornelissen/webmangler/pull/156
[#173]: https://github.com/ericcornelissen/webmangler/pull/173
[#226]: https://github.com/ericcornelissen/webmangler/pull/226
[#242]: https://github.com/ericcornelissen/webmangler/pull/242
[#250]: https://github.com/ericcornelissen/webmangler/pull/250
[keep a changelog]: https://keepachangelog.com/en/1.0.0/ "Keep a CHANGELOG"
[semantic versioning]: https://semver.org/spec/v2.0.0.html "Semantic versioning"
