import type { MangleOptions } from "@webmangler/types";

import type { MultiValueAttributeOptions } from "../types";

import { expect } from "chai";

import CssClassMangler from "../class";

suite("CSS Class Mangler", function() {
  suite("Configuration", function() {
    suite("::classNamePattern", function() {
      const DEFAULT_PATTERNS = ["cls-[a-zA-Z-_]+"];

      test("default patterns", function() {
        const cssClassMangler = new CssClassMangler();
        const result = cssClassMangler.options();
        expect(result).to.deep.include({ patterns: DEFAULT_PATTERNS });
      });

      test("one custom pattern", function() {
        const pattern = "foo(bar|baz)-[a-z]+";

        const cssClassMangler = new CssClassMangler({
          classNamePattern: pattern,
        });
        const result = cssClassMangler.options();
        expect(result).to.deep.include({ patterns: pattern });
      });

      test("multiple custom patterns", function() {
        const patterns: string[] = ["foobar-[a-z]+", "foobar-[0-9]+"];

        const cssClassMangler = new CssClassMangler({
          classNamePattern: patterns,
        });
        const result = cssClassMangler.options();
        expect(result).to.deep.include({ patterns: patterns });
      });
    });

    suite("::ignoreClassNamePattern", function() {
      const DEFAULT_PATTERNS: string[] = [];

      test("default patterns", function() {
        const cssClassMangler = new CssClassMangler();
        const result = cssClassMangler.options();
        expect(result).to.deep.include({ ignorePatterns: DEFAULT_PATTERNS });
      });

      test("one custom pattern", function() {
        const ignorePatterns = "foo(bar|baz)-[a-z]+";

        const cssClassMangler = new CssClassMangler({
          ignoreClassNamePattern: ignorePatterns,
        });
        const result = cssClassMangler.options();
        expect(result).to.deep.include({ ignorePatterns: ignorePatterns });
      });

      test("multiple custom patterns", function() {
        const ignorePatterns: string[] = ["foobar-[a-z]+", "foobar-[0-9]+"];

        const cssClassMangler = new CssClassMangler({
          ignoreClassNamePattern: ignorePatterns,
        });
        const result = cssClassMangler.options();
        expect(result).to.deep.include({ ignorePatterns: ignorePatterns });
      });
    });

    suite("::reservedClassNames", function() {
      test("default reserved", function() {
        const cssClassMangler = new CssClassMangler();
        const result = cssClassMangler.options();
        expect(result).to.have.property("reservedNames").that.is.not.empty;
      });

      test("custom reserved", function() {
        const reserved: string[] = ["foo", "bar"];

        const cssClassMangler = new CssClassMangler({
          reservedClassNames: reserved,
        });

        const result = cssClassMangler.options();
        expect(result).to.have.property("reservedNames");

        const reservedNames = Array.from(result.reservedNames as string[]);
        expect(reservedNames).to.include.members(reserved);
      });
    });

    suite("::keepClassNamePrefix", function() {
      const DEFAULT_MANGLE_PREFIX = "";

      test("default prefix", function() {
        const cssClassMangler = new CssClassMangler();
        const result = cssClassMangler.options();
        expect(result).to.deep.include({ manglePrefix: DEFAULT_MANGLE_PREFIX });
      });

      test("custom prefix", function() {
        const prefix = "foobar";

        const cssClassMangler = new CssClassMangler({
          keepClassNamePrefix: prefix,
        });
        const result = cssClassMangler.options();
        expect(result).to.deep.include({ manglePrefix: prefix });
      });
    });

    suite("::classAttributes", function() {
      const standardClassAttributes = ["class"];

      const getLanguageOptions = (
        mangleOptions: MangleOptions,
      ): MultiValueAttributeOptions => {
        const allLanguageOptions = Array.from(mangleOptions.languageOptions);
        const languageOptions = allLanguageOptions[1];
        return languageOptions?.options as MultiValueAttributeOptions;
      };

      const cases: { classAttributes: string[], expected: string[] }[] = [
        {
          classAttributes: undefined as unknown as string[],
          expected: [...standardClassAttributes],
        },
        {
          classAttributes: [],
          expected: [...standardClassAttributes],
        },
        {
          classAttributes: ["foo", "bar"],
          expected: [...standardClassAttributes, "foo", "bar"],
        },
        {
          classAttributes: [...standardClassAttributes, "foo", "bar"],
          expected: [...standardClassAttributes, "foo", "bar"],
        },
      ];

      test("different configurations", function() {
        for (const testCase of cases) {
          const { expected, classAttributes } = testCase;
          const cssClassMangler = new CssClassMangler({ classAttributes });
          const mangleOptions = cssClassMangler.options();
          const options = getLanguageOptions(mangleOptions);
          expect(options).not.to.be.undefined;

          const attributeNames = Array.from(options.attributeNames);
          expect(attributeNames).not.to.be.undefined;
          expect(attributeNames).to.include.members(expected);
        }
      });
    });
  });
});
