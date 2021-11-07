import type { MangleOptions } from "@webmangler/types";

import type { HtmlAttributeManglerOptions } from "../../types";

import { expect } from "chai";
import { toArray } from "lodash";

import HtmlAttributeMangler from "../../class";

suite("HTML Attribute Mangler", function() {
  const defaultIgnorePatterns: string[] = [];
  const defaultManglePrefix = "data-";
  const defaultPatterns: string[] = [
    "data-[a-z-]+",
  ];
  const alwaysReservedNames: string[] = [
    "([0-9]|-|_).*",
  ];

  interface TestCase {
    readonly name: string;
    readonly options?: HtmlAttributeManglerOptions;
  }

  const testCases: TestCase[] = [
    {
      name: "no options",
      options: undefined,
    },
    {
      name: "empty options",
      options: { },
    },
    {
      name: "attribute name patterns only",
      options: {
        attrNamePattern: ["foo", "bar"],
      },
    },
    {
      name: "ignore patterns only",
      options: {
        ignoreAttrNamePattern: ["foo", "bar"],
      },
    },
    {
      name: "reserved patterns only",
      options: {
        reservedAttrNames: ["foo", "bar"],
      },
    },
    {
      name: "keepAttrPrefix only",
      options: {
        keepAttrPrefix: "foobar-",
      },
    },
  ];

  for (const { name, options } of testCases) {
    suite(`${name} - ::options()`, function() {
      let mangleOptions: MangleOptions;

      setup(function() {
        const subject = new HtmlAttributeMangler(options);
        mangleOptions = subject.options() as MangleOptions;
      });

      test("the character set is defined", function() {
        const charSet = mangleOptions.charSet;
        expect(charSet).not.to.be.undefined;
      });

      test("the ignore patterns are defined correctly", function() {
        const ignorePatterns = toArray(mangleOptions.ignorePatterns);
        expect(ignorePatterns).not.to.be.undefined;

        const expected: string[] = [];
        if (options?.ignoreAttrNamePattern) {
          expected.push(...options.ignoreAttrNamePattern);
        } else {
          expected.push(...defaultIgnorePatterns);
        }

        expect(ignorePatterns).to.include.members(expected);
        expect(ignorePatterns).to.have.length(expected.length);
      });

      test("the mangle prefix is defined correctly", function() {
        const manglePrefix = mangleOptions.manglePrefix;
        expect(manglePrefix).not.to.be.undefined;

        if (options?.keepAttrPrefix) {
          expect(manglePrefix).to.equal(options.keepAttrPrefix);
        } else {
          expect(manglePrefix).to.equal(defaultManglePrefix);
        }
      });

      test("the patterns are defined correctly", function() {
        const patterns = toArray(mangleOptions.patterns);
        expect(patterns).not.to.be.undefined;

        const expected: string[] = [];
        if (options?.attrNamePattern) {
          expected.push(...options.attrNamePattern);
        } else {
          expected.push(...defaultPatterns);
        }

        expect(patterns).to.include.members(expected);
        expect(patterns).to.have.length(expected.length);
      });

      test("the reserved names are defined correctly", function() {
        const reservedNames = toArray(mangleOptions.reservedNames);
        expect(reservedNames).not.to.be.undefined;

        const expected: string[] = [
          ...alwaysReservedNames,
        ];
        if (options?.reservedAttrNames) {
          expected.push(...options.reservedAttrNames);
        }

        expect(reservedNames).to.include.members(expected);
        expect(reservedNames).to.have.length(expected.length);
      });

      test("the language options are defined", function() {
        const languageOptions = mangleOptions.languageOptions;
        expect(languageOptions).not.to.be.undefined;
      });
    });
  }
});
