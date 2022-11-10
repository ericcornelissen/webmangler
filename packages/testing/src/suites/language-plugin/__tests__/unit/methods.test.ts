import type { WebManglerLanguagePluginConstructor } from "../../types";

import { expect } from "chai";

import {
  checkGetEmbeds,
  checkGetExpressions,
  checkGetLanguages,
} from "../../methods";

suite("Language plugin method checks", function() {
  suite("::checkGetEmbeds", function() {
    test("method works as expected", function() {
      const constructor = function() {
        return {
          getEmbeds: () => [],
        };
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkGetEmbeds(constructor);
      expect(result).to.be.null;
    });

    test("method returns nothing", function() {
      const constructor = function() {
        return {
          getEmbeds: () => undefined,
        };
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkGetEmbeds(constructor);
      expect(result).to.match(/no list of embeds/);
    });

    test("method throws", function() {
      const constructor = function() {
        return {
          getEmbeds: () => {
            throw new Error();
          },
        };
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkGetEmbeds(constructor);
      expect(result).to.match(/cannot get embeds/);
    });

    test("methods is missing", function() {
      const constructor = function() {
        return {};
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkGetEmbeds(constructor);
      expect(result).to.match(/cannot get embeds/);
    });
  });

  suite("::checkGetExpressions", function() {
    test("method works as expected", function() {
      const constructor = function() {
        return {
          getExpressions: () => [],
        };
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkGetExpressions(constructor);
      expect(result).to.be.null;
    });

    test("method returns nothing", function() {
      const constructor = function() {
        return {
          getExpressions: () => undefined,
        };
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkGetExpressions(constructor);
      expect(result).to.match(/no list of expressions/);
    });

    test("method throws", function() {
      const constructor = function() {
        return {
          getExpressions: () => {
            throw new Error();
          },
        };
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkGetExpressions(constructor);
      expect(result).to.match(/cannot get expressions/);
    });

    test("methods is missing", function() {
      const constructor = function() {
        return {};
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkGetExpressions(constructor);
      expect(result).to.match(/cannot get expressions/);
    });
  });

  suite("::checkGetLanguages", function() {
    test("method works as expected", function() {
      const constructor = function() {
        return {
          getLanguages: () => [],
        };
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkGetLanguages(constructor);
      expect(result).to.be.null;
    });

    test("method returns nothing", function() {
      const constructor = function() {
        return {
          getLanguages: () => undefined,
        };
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkGetLanguages(constructor);
      expect(result).to.match(/no list of languages/);
    });

    test("method throws", function() {
      const constructor = function() {
        return {
          getLanguages: () => {
            throw new Error();
          },
        };
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkGetLanguages(constructor);
      expect(result).to.match(/cannot get languages/);
    });

    test("methods is missing", function() {
      const constructor = function() {
        return {};
      } as unknown as WebManglerLanguagePluginConstructor;

      const result = checkGetLanguages(constructor);
      expect(result).to.match(/cannot get languages/);
    });
  });
});
