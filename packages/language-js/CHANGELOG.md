# Changelog

All notable changes to the _WebMangler Language JavaScript_ project will be
documented in this file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [Unreleased]

- Fix query selectors not being mangled due to escaped quotes. ([#237])

## [0.1.25] - 2022-01-08

- Fix unintentional mangling in inline comments with newlines. ([#224])

## [0.1.24] - 2021-09-05

- Fix query selectors in certain cases not being mangled. ([#125])
- Fix unintentional mangling in comments. ([#139])

## [0.1.23] - 2021-07-18

- Extract the _Webmangler Core_ JS language plugin into this package. ([#136])

[#125]: https://github.com/ericcornelissen/webmangler/pull/125
[#136]: https://github.com/ericcornelissen/webmangler/pull/136
[#139]: https://github.com/ericcornelissen/webmangler/pull/139
[#224]: https://github.com/ericcornelissen/webmangler/pull/224
[#237]: https://github.com/ericcornelissen/webmangler/pull/237
[keep a changelog]: https://keepachangelog.com/en/1.0.0/ "Keep a CHANGELOG"
[semantic versioning]: https://semver.org/spec/v2.0.0.html "Semantic versioning"
