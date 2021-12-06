import type {
  MangleOptions,
  SingleValueAttributeOptions,
} from "@webmangler/types";

import { expect } from "chai";

import HtmlIdMangler from "../class";

suite("HTML ID Mangler", function() {
  suite("Configuration", function() {
    suite("::idNamePatterns", function() {
      const DEFAULT_PATTERNS = ["id-[a-zA-Z-_]+"];

      test("default patterns", function() {
        const htmlIdMangler = new HtmlIdMangler();
        const result = htmlIdMangler.options() as MangleOptions;
        expect(result).to.deep.include({ patterns: DEFAULT_PATTERNS });
      });

      test("custom pattern", function() {
        const pattern = "foo(bar|baz)-[a-z]+";

        const htmlIdMangler = new HtmlIdMangler({ idNamePattern: pattern });
        const result = htmlIdMangler.options() as MangleOptions;
        expect(result).to.deep.include({ patterns: pattern });
      });

      test("custom patterns", function() {
        const patterns: string[] = ["foobar-[a-z]+", "foobar-[0-9]+"];

        const htmlIdMangler = new HtmlIdMangler({ idNamePattern: patterns });
        const result = htmlIdMangler.options() as MangleOptions;
        expect(result).to.deep.include({ patterns: patterns });
      });
    });

    suite("::ignoreIdNamePattern", function() {
      const DEFAULT_PATTERNS: string[] = [];

      test("default patterns", function() {
        const htmlIdMangler = new HtmlIdMangler();
        const result = htmlIdMangler.options() as MangleOptions;
        expect(result).to.deep.include({ ignorePatterns: DEFAULT_PATTERNS });
      });

      test("one custom pattern", function() {
        const ignorePatterns = "foo(bar|baz)-[a-z]+";

        const htmlIdMangler = new HtmlIdMangler({
          ignoreIdNamePattern: ignorePatterns,
        });
        const result = htmlIdMangler.options() as MangleOptions;
        expect(result).to.deep.include({ ignorePatterns: ignorePatterns });
      });

      test("multiple custom patterns", function() {
        const ignorePatterns: string[] = ["foobar-[a-z]+", "foobar-[0-9]+"];

        const htmlIdMangler = new HtmlIdMangler({
          ignoreIdNamePattern: ignorePatterns,
        });
        const result = htmlIdMangler.options() as MangleOptions;
        expect(result).to.deep.include({ ignorePatterns: ignorePatterns });
      });
    });

    suite("::reservedIds", function() {
      test("default reserved", function() {

        const htmlIdMangler = new HtmlIdMangler();
        const result = htmlIdMangler.options() as MangleOptions;
        expect(result).to.have.property("reservedNames").that.is.empty;
      });

      test("custom reserved", function() {
        const reserved: string[] = ["foo", "bar"];

        const htmlIdMangler = new HtmlIdMangler({ reservedIds: reserved });
        const result = htmlIdMangler.options() as MangleOptions;
        expect(result).to.deep.include({ reservedNames: reserved });
      });
    });

    suite("::keepIdPrefix", function() {
      const DEFAULT_MANGLE_PREFIX = "";

      test("default prefix", function() {
        const htmlIdMangler = new HtmlIdMangler();
        const result = htmlIdMangler.options() as MangleOptions;
        expect(result).to.deep.include({ manglePrefix: DEFAULT_MANGLE_PREFIX });
      });

      test("custom prefix", function() {
        const prefix = "foobar";

        const htmlIdMangler = new HtmlIdMangler({ keepIdPrefix: prefix });
        const result = htmlIdMangler.options() as MangleOptions;
        expect(result).to.deep.include({ manglePrefix: prefix });
      });
    });

    suite("::idAttributes", function() {
      const standardIdAttributes = ["id", "for"];

      const getLanguageOptions = (
        mangleOptions: MangleOptions,
      ): SingleValueAttributeOptions => {
        const allLanguageOptions = Array.from(mangleOptions.languageOptions);
        const languageOptions = allLanguageOptions[1];
        return languageOptions?.options as SingleValueAttributeOptions;
      };

      const cases: { idAttributes: string[]; expected: string[]; }[] = [
        {
          idAttributes: undefined as unknown as string[],
          expected: [...standardIdAttributes],
        },
        {
          idAttributes: [],
          expected: [...standardIdAttributes],
        },
        {
          idAttributes: ["foo", "bar"],
          expected: [...standardIdAttributes, "foo", "bar"],
        },
        {
          idAttributes: [...standardIdAttributes, "foo", "bar"],
          expected: [...standardIdAttributes, "foo", "bar"],
        },
      ];

      test("different configurations", function() {
        for (const testCase of cases) {
          const { expected, idAttributes } = testCase;
          const htmlIdMangler = new HtmlIdMangler({ idAttributes });
          const mangleOptions = htmlIdMangler.options() as MangleOptions;
          const options = getLanguageOptions(mangleOptions);
          expect(options).not.to.be.undefined;

          const attributeNames = Array.from(options.attributeNames);
          expect(attributeNames).not.to.be.undefined;
          expect(attributeNames).to.include.members(expected);

          const valuePrefix = options.valuePrefix;
          expect(valuePrefix).to.be.undefined;

          const valueSuffix = options.valueSuffix;
          expect(valueSuffix).to.be.undefined;
        }
      });
    });

    suite("::urlAttributes", function() {
      const standardUrlAttributes = ["href"];

      const getLanguageOptions = (
        mangleOptions: MangleOptions,
      ): SingleValueAttributeOptions => {
        const allLanguageOptions = Array.from(mangleOptions.languageOptions);
        const languageOptions = allLanguageOptions[2];
        return languageOptions?.options as SingleValueAttributeOptions;
      };

      const cases: { urlAttributes: string[]; expected: string[]; }[] = [
        {
          urlAttributes: undefined as unknown as string[],
          expected: [...standardUrlAttributes],
        },
        {
          urlAttributes: [],
          expected: [...standardUrlAttributes],
        },
        {
          urlAttributes: ["foo", "bar"],
          expected: [...standardUrlAttributes, "foo", "bar"],
        },
        {
          urlAttributes: [...standardUrlAttributes, "foo", "bar"],
          expected: [...standardUrlAttributes, "foo", "bar"],
        },
      ];

      test("different configurations", function() {
        for (const testCase of cases) {
          const { expected, urlAttributes } = testCase;
          const htmlIdMangler = new HtmlIdMangler({ urlAttributes });
          const mangleOptions = htmlIdMangler.options() as MangleOptions;
          const options = getLanguageOptions(mangleOptions);
          expect(options).not.to.be.undefined;

          const attributeNames = Array.from(options.attributeNames);
          expect(attributeNames).not.to.be.undefined;
          expect(attributeNames).to.include.members(expected);

          const valuePrefix = options.valuePrefix as string;
          expect(valuePrefix).not.to.be.undefined;
          expect(() => new RegExp(valuePrefix)).not.to.throw();

          const valueSuffix = options.valueSuffix as string;
          expect(valueSuffix).to.be.undefined;
        }
      });
    });
  });
});
