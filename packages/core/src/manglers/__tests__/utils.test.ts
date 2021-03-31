import { expect } from "chai";

import * as utils from "../utils";

suite("Exports of webmangler/manglers/utils", function() {
  suite("WebManglerPlugins", function() {
    test("has MultiMangler", function() {
      expect(utils).to.haveOwnProperty("MultiMangler");
    });

    test("has MultiManglerPlugin", function() {
      expect(utils).to.haveOwnProperty("MultiManglerPlugin");
    });

    test("has SimpleManglerPlugin", function() {
      expect(utils).to.haveOwnProperty("SimpleManglerPlugin");
    });
  });
});
