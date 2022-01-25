# Changelog

All notable changes to the _WebMangler Testing_ project will be documented in
this file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [Unreleased]

- _No changes yet_

## [0.1.6] - 2022-01-17

- Add basic test suites for the _WebMangler_ plugin interface. ([#234])
- Add `TestScenarios` type for parameterized tests. ([#199])
- Deprecate the `TestScenario` type. ([#199])
- Drop Sinon.JS v10 support. ([ce8ec9a])
- Fix return value of `MangleExpressionMock.replaceAll`. ([#190])

## [0.1.5] - 2021-06-15

- Add utilities for generating test cases. ([#91])
- Update the constructor interfaces of all mocks. ([cc6ced9])

## [0.1.4] - 2021-05-30

- Add `getEmbeds` to `WebManglerPluginLanguageMock`. ([#90])

## [0.1.3] - 2021-05-12

- Add `findAll` method to `MangleExpressionMock`. ([#82])
- Drop Sinon.JS v9 support. ([9d0fcc5])

## [0.1.2] - 2021-03-19

- Add README with basic documentation. ([56b0fb6])
- Add `.getExpressions` method to `WebManglerLanguagePlugin`. ([775c343])

## [0.1.1] - 2021-03-14

- Add mocks for `MangleExpression`, `WebManglerFile`, `WebManglerPlugin`, and
  `WebManglerLanguagePlugin`. ([#33])

## [0.1.0] - 2021-02-10

- Add interface for structuring generated tests. ([6175995])

[#33]: https://github.com/ericcornelissen/webmangler/pull/33
[#82]: https://github.com/ericcornelissen/webmangler/pull/82
[#90]: https://github.com/ericcornelissen/webmangler/pull/90
[#91]: https://github.com/ericcornelissen/webmangler/pull/91
[#190]: https://github.com/ericcornelissen/webmangler/pull/190
[#199]: https://github.com/ericcornelissen/webmangler/pull/199
[#234]: https://github.com/ericcornelissen/webmangler/pull/234
[56b0fb6]: https://github.com/ericcornelissen/webmangler/commit/56b0fb6c3755d84d556c528610dc7387d6327b47
[6175995]: https://github.com/ericcornelissen/webmangler/commit/617599564ec741f4b5a6ca0f47295f3db1817fb5
[775c343]: https://github.com/ericcornelissen/webmangler/commit/775c34321bad41e9171b70ed5a33d72d793bf0f6
[9d0fcc5]: https://github.com/ericcornelissen/webmangler/commit/9d0fcc53ea98edb7a5f2c6e9865d7984c9983219
[cc6ced9]: https://github.com/ericcornelissen/webmangler/commit/cc6ced997bb1cf52ed76fdeab94c0e0e17edad48
[ce8ec9a]: https://github.com/ericcornelissen/webmangler/commit/ce8ec9a6218cbbb8c32930a1737ec4c62254f615
[keep a changelog]: https://keepachangelog.com/en/1.0.0/ "Keep a CHANGELOG"
[semantic versioning]: https://semver.org/spec/v2.0.0.html "Semantic versioning"
