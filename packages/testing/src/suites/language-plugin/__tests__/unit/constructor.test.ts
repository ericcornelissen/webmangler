import type { WebManglerLanguagePluginConstructor } from "../../types";

import { expect } from "chai";

import {
  checkConstructor,
} from "../../constructor";

suite("Language plugin constructor checks", function() {
  suite("::checkConstructor", function() {
    test("constructor works as expected", function() {
      const constructor = function() {
        return { };
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkConstructor(constructor);
      expect(result).to.be.null;
    });

    test("constructor throws when not provided with options", function() {
      const constructor = function(options?: unknown) {
        if (!options) {
          throw new Error();
        }
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkConstructor(constructor);
      expect(result).to.match(/without options/);
    });

    test("constructor throws when not provided with empty options", function() {
      const constructor = function(options?: Record<string, unknown>) {
        if (!options) {
          return;
        }

        throw new Error();
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkConstructor(constructor);
      expect(result).to.match(/with empty options/);
    });
  });
});
