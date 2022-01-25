import type { WebManglerPluginConstructor } from "../../types";

import { expect } from "chai";

import {
  checkOptions,
} from "../../methods";

suite("Plugin method checks", function() {
  suite("::checkOptions", function() {
    test("method works as expected, returns an object", function() {
      const constructor = function() {
        return {
          options: () => ({ }),
        };
      } as unknown as WebManglerPluginConstructor;

      const result = checkOptions(constructor);
      expect(result).to.be.null;
    });

    test("method works as expected, returns an array", function() {
      const constructor = function() {
        return {
          options: () => [],
        };
      } as unknown as WebManglerPluginConstructor;

      const result = checkOptions(constructor);
      expect(result).to.be.null;
    });

    test("method returns nothing", function() {
      const constructor = function() {
        return {
          options: () => void 0,
        };
      } as unknown as WebManglerPluginConstructor;

      const result = checkOptions(constructor);
      expect(result).to.match(/no options/);
    });

    test("method throws", function() {
      const constructor = function() {
        return {
          options: () => {
            throw new Error();
          },
        };
      } as unknown as WebManglerPluginConstructor;

      const result = checkOptions(constructor);
      expect(result).to.match(/cannot get options/);
    });

    test("methods is missing", function() {
      const constructor = function() {
        return {};
      } as unknown as WebManglerPluginConstructor;

      const result = checkOptions(constructor);
      expect(result).to.match(/cannot get options/);
    });
  });
});
