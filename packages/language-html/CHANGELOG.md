# Changelog

All notable changes to the _WebMangler Language HTML_ project will be documented
in this file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [Unreleased]

- Bump minimum `@webmangler/language-utils` version to `^0.1.27`. ([#322])
- Improve detection of CSS embedding. ([#326])

## [0.1.26] - 2022-01-29

- Bump minimum `@webmangler/language-utils` version to `^0.1.26`. ([#250])

## [0.1.25] - 2022-01-17

- Fix finding when embeds with non-standard closing tags. ([#241])
- Fix unintentional mangling in comments with non-standard syntax. ([#233])

## [0.1.24] - 2022-01-08

- Detect JavaScript embeds regardless of tag casing. ([#225])
- Detect CSS embeds regardless of tag or attribute casing. ([#225])
- Fix unintentional mangling in comments with newlines. ([#231])

## [0.1.23] - 2021-07-17

- Extract the _Webmangler Core_ HTML language plugin into this package. ([#136])

[#136]: https://github.com/ericcornelissen/webmangler/pull/136
[#225]: https://github.com/ericcornelissen/webmangler/pull/225
[#231]: https://github.com/ericcornelissen/webmangler/pull/231
[#233]: https://github.com/ericcornelissen/webmangler/pull/233
[#241]: https://github.com/ericcornelissen/webmangler/pull/241
[#250]: https://github.com/ericcornelissen/webmangler/pull/250
[#322]: https://github.com/ericcornelissen/webmangler/pull/322
[#326]: https://github.com/ericcornelissen/webmangler/pull/326
[keep a changelog]: https://keepachangelog.com/en/1.0.0/ "Keep a CHANGELOG"
[semantic versioning]: https://semver.org/spec/v2.0.0.html "Semantic versioning"
