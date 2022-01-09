# Changelog

All notable changes to the _WebMangler Language HTML_ project will be documented
in this file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [Unreleased]

- Detect JavaScript embeds regardless of tag casing. ([#225])
- Detect CSS embeds regardless of tag or attribute casing. ([#225])
- Fix unintentional mangling in comments with newlines. ([#231])
- Fix unintentional mangling in comments with non-standard syntax. ([#233])

## [0.1.23] - 2021-07-17

- Extract the _Webmangler Core_ HTML language plugin into this package.

[#225]: https://github.com/ericcornelissen/webmangler/pull/225
[#231]: https://github.com/ericcornelissen/webmangler/pull/231
[#233]: https://github.com/ericcornelissen/webmangler/pull/233
[keep a changelog]: https://keepachangelog.com/en/1.0.0/ "Keep a CHANGELOG"
[semantic versioning]: https://semver.org/spec/v2.0.0.html "Semantic versioning"
