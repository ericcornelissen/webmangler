import { expect } from "chai";

import { BuiltInLanguagesSupport } from "../languages";
import { RecommendedManglers } from "../manglers";

import * as webmangler from "../index";

suite("Webmangler core", function() {
  suite("Exports", function() {
    test("has a default exported value", function() {
      expect(webmangler).to.haveOwnProperty("default");
    });
  });

  suite("Smoke test", function() {
    const run = webmangler.default;

    test("basic usage", function() {
      const files = [
        { content: ".foo { }", type: "css" },
      ];

      const result = run(files, {
        plugins: [new RecommendedManglers()],
        languages: [new BuiltInLanguagesSupport()],
      });

      expect(result.files).to.have.lengthOf(files.length);
    });
  });
});
