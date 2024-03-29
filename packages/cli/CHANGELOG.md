# Changelog

All notable changes to the _WebMangler CLI_ project will be documented in this
file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [Unreleased]

- Add support for Node.js v20. ([#444])
- Bump minimum `cosmiconfig` from `^8.0.0` to `^9.0.0`. ([#475])

## [0.1.11] - 2023-05-01

- Bump minimum `cosmiconfig` from `^7.0.0` to `^8.0.0`. ([#433])

## [0.1.10] - 2022-11-10

- BREAKING: Bump the minimum Node.js version to v14.18.0. ([#416])
- BREAKING: Republish as `@webmangler/cli`. ([#424])

## [0.1.9] - 2022-09-10

- Add "pretty-print" option to the `JsonReporter`. ([#325])
- Use relative paths for file references in reports. ([#333])

## [0.1.8] - 2022-07-02

- Add support for configuring the reporter of mangling results. ([#291])
- Export a JSON reporter. ([#315])
- Export the (pre-existing) default reporter. ([#318])
- Use file handles when obtaining `--version` information. ([#280])

## [0.1.7] - 2022-01-29

- Increase minimum `webmangler` peerDependency to `^0.1.25`. ([#244])

## [0.1.6] - 2021-04-17

- Add mangling time to the `--stats` output.
- Add support for `webmangler` versions `^0.1.17`.

## [0.1.5] - 2021-03-19

- Include `LICENSE` in published package.
- Improve wording in documentation.
- Read and write files in parallel.

## [0.1.4] - 2021-02-25

- Increase minimum `webmangler` peerDependency to `^0.1.13`.
- Include overall statistics when outputting mangling statistics.
- Use cosmiconfig to load configuration files.

## [0.1.3] - 2021-02-12

- Increase minimum `webmangler` peerDependency to `^0.1.9`.
- Fix percentages reported with `--stats`/`-S`.
- Color percentages of `--stats`/`-S` output.
- Only read supported files from disk.

## [0.1.2] - 2021-02-11

- Increase minimum `webmangler` peerDependency to `^0.1.7`.
- Enable mangling statistics with `--stats`/`-S`.
- Enable verbose logging with `--verbose`/`-v`/`-vv`.

## [0.1.1] - 2021-02-03

- Increase minimum `webmangler` peerDependency to `^0.1.4`.
- Fix formatting in examples of the README.
- Fix NPM scripts example in the README.
- Add WebMangler core and NodeJS version to `--version` output.

## [0.1.0] - 2021-02-02

- Initial release with writing capabilities and basic configuration
- Read configuration from `.webmanglerrc.js` or `webmangler.config.js`.
- Configure the configuration file with the `--config`/`-c` option.
- Enable writing to files with the `--write`/`-w` option.

[#244]: https://github.com/ericcornelissen/webmangler/pull/244
[#280]: https://github.com/ericcornelissen/webmangler/pull/280
[#291]: https://github.com/ericcornelissen/webmangler/pull/291
[#315]: https://github.com/ericcornelissen/webmangler/pull/315
[#318]: https://github.com/ericcornelissen/webmangler/pull/318
[#325]: https://github.com/ericcornelissen/webmangler/pull/325
[#333]: https://github.com/ericcornelissen/webmangler/pull/333
[#416]: https://github.com/ericcornelissen/webmangler/pull/416
[#424]: https://github.com/ericcornelissen/webmangler/pull/424
[#433]: https://github.com/ericcornelissen/webmangler/pull/433
[#444]: https://github.com/ericcornelissen/webmangler/pull/444
[#475]: https://github.com/ericcornelissen/webmangler/pull/475
[keep a changelog]: https://keepachangelog.com/en/1.0.0/ "Keep a CHANGELOG"
[semantic versioning]: https://semver.org/spec/v2.0.0.html "Semantic versioning"
