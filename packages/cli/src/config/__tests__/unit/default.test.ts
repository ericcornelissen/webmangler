import type { WebManglerOptions } from "@webmangler/types";

import { expect } from "chai";

import { newDefaultConfig } from "../../default";

suite("Configuration defaults", function() {
  let defaultConfig: WebManglerOptions;

  suiteSetup(function() {
    defaultConfig = newDefaultConfig();
  });

  test("plugins", function() {
    expect(defaultConfig.plugins).to.have.length.above(0);
  });

  test("languages", function() {
    expect(defaultConfig.languages).to.have.length.above(0);
  });
});
