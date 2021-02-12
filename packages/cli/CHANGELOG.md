# Changelog

All notable changes to the _WebMangler CLI_ project will be documented in this
file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [Unreleased]

- Increase minimum `webmangler` peerDependency to `^0.1.9`.
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

[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html
