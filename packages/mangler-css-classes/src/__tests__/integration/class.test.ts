import type { MangleOptions } from "@webmangler/types";

import type { CssClassManglerOptions } from "../../types";

import { expect } from "chai";
import { toArray } from "lodash";

import CssClassMangler from "../../index";

suite("CssClassMangler", function() {
  const defaultIgnorePatterns: string[] = [];
  const defaultManglePrefix = "";
  const defaultPatterns: string[] = [
    "cls-[a-zA-Z-_]+",
  ];
  const alwaysReservedNames: string[] = ["(-|[0-9]).*"];

  interface TestCase {
    readonly name: string;
    readonly options?: CssClassManglerOptions;
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
      name: "class name patterns only",
      options: {
        classNamePattern: ["foo", "bar"],
      },
    },
    {
      name: "ignore patterns only",
      options: {
        ignoreClassNamePattern: ["foo", "bar"],
      },
    },
    {
      name: "reserved patterns only",
      options: {
        reservedClassNames: ["foo", "bar"],
      },
    },
    {
      name: "keepClassNamePrefix only",
      options: {
        keepClassNamePrefix: "cls-",
      },
    },
    {
      name: "classAttributes only",
      options: {
        classAttributes: ["foo", "bar"],
      },
    },
  ];

  for (const { name, options } of testCases) {
    suite(`${name} - ::options()`, function() {
      let mangleOptions: MangleOptions;

      setup(function() {
        const subject = new CssClassMangler(options);
        mangleOptions = subject.options();
      });

      test("the character set is defined", function() {
        const charSet = mangleOptions.charSet;
        expect(charSet).not.to.be.undefined;
      });

      test("the ignore patterns are defined correctly", function() {
        const ignorePatterns = toArray(mangleOptions.ignorePatterns);
        expect(ignorePatterns).not.to.be.undefined;

        const expected: string[] = [];
        if (options?.ignoreClassNamePattern) {
          expected.push(...options.ignoreClassNamePattern);
        } else {
          expected.push(...defaultIgnorePatterns);
        }

        expect(ignorePatterns).to.include.members(expected);
        expect(ignorePatterns).to.have.length(expected.length);
      });

      test("the mangle prefix is defined correctly", function() {
        const manglePrefix = mangleOptions.manglePrefix;
        expect(manglePrefix).not.to.be.undefined;

        if (options?.keepClassNamePrefix) {
          expect(manglePrefix).to.equal(options.keepClassNamePrefix);
        } else {
          expect(manglePrefix).to.equal(defaultManglePrefix);
        }
      });

      test("the patterns are defined correctly", function() {
        const patterns = toArray(mangleOptions.patterns);
        expect(patterns).not.to.be.undefined;

        const expected: string[] = [];
        if (options?.classNamePattern) {
          expected.push(...options.classNamePattern);
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
        if (options?.reservedClassNames) {
          expected.push(...options.reservedClassNames);
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
