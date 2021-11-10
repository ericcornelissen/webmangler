import type { MangleOptions } from "@webmangler/types";

import { expect } from "chai";

import CssVariableMangler from "../../index";

suite("CSS Variable Mangler", function() {
  suite("Configuration", function() {
    suite("::cssVarNamePattern", function() {
      const DEFAULT_PATTERNS = ["[a-zA-Z-]+"];

      test("default patterns", function() {
        const cssVariableMangler = new CssVariableMangler();
        const result = cssVariableMangler.options();
        expect(result).to.deep.include({ patterns: DEFAULT_PATTERNS });
      });

      test("custom pattern", function() {
        const pattern = "foo(bar|baz)-[a-z]+";

        const cssVariableMangler = new CssVariableMangler({
          cssVarNamePattern: pattern,
        });
        const result = cssVariableMangler.options();
        expect(result).to.deep.include({ patterns: pattern });
      });

      test("custom patterns", function() {
        const patterns: string[] = ["foobar-[a-z]+", "foobar-[0-9]+"];

        const cssVariableMangler = new CssVariableMangler({
          cssVarNamePattern: patterns,
        });
        const result = cssVariableMangler.options();
        expect(result).to.deep.include({ patterns: patterns });
      });
    });

    suite("::ignoreCssVarNamePattern", function() {
      const DEFAULT_PATTERNS: string[] = [];

      test("default patterns", function() {
        const cssVariableMangler = new CssVariableMangler();
        const result = cssVariableMangler.options();
        expect(result).to.deep.include({ ignorePatterns: DEFAULT_PATTERNS });
      });

      test("one custom pattern", function() {
        const ignorePatterns = "foo(bar|baz)-[a-z]+";

        const cssVariableMangler = new CssVariableMangler({
          ignoreCssVarNamePattern: ignorePatterns,
        });
        const result = cssVariableMangler.options();
        expect(result).to.deep.include({ ignorePatterns: ignorePatterns });
      });

      test("multiple custom patterns", function() {
        const ignorePatterns: string[] = ["foobar-[a-z]+", "foobar-[0-9]+"];

        const cssVariableMangler = new CssVariableMangler({
          ignoreCssVarNamePattern: ignorePatterns,
        });
        const result = cssVariableMangler.options();
        expect(result).to.deep.include({ ignorePatterns: ignorePatterns });
      });
    });

    suite("::reservedCssVarNames", function() {
      test("default reserved", function() {
        const cssVariableMangler = new CssVariableMangler();
        const result = cssVariableMangler.options();
        expect(result).to.have.property("reservedNames").that.is.not.empty;
      });

      test("custom reserved", function() {
        const reserved: string[] = ["foo", "bar"];

        const cssVariableMangler = new CssVariableMangler({
          reservedCssVarNames: reserved,
        });

        const result = cssVariableMangler.options() as MangleOptions;
        expect(result).to.have.property("reservedNames");

        const reservedNames = Array.from(result.reservedNames as string[]);
        expect(reservedNames).to.include.members(reserved);
      });
    });

    suite("::keepCssVarPrefix", function() {
      const DEFAULT_MANGLE_PREFIX = "";

      test("default prefix", function() {
        const cssVariableMangler = new CssVariableMangler();
        const result = cssVariableMangler.options();
        expect(result).to.deep.include({ manglePrefix: DEFAULT_MANGLE_PREFIX });
      });

      test("custom prefix", function() {
        const prefix = "foobar";

        const cssVariableMangler = new CssVariableMangler({
          keepCssVarPrefix: prefix,
        });
        const result = cssVariableMangler.options();
        expect(result).to.deep.include({ manglePrefix: prefix });
      });
    });
  });
});
