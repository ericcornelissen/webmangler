import type { MangleOptions } from "@webmangler/types";

import { expect } from "chai";

import HtmlAttributeMangler from "../../index";

suite("HTML Attribute Mangler", function() {
  suite("Configuration", function() {
    suite("::attrNamePattern", function() {
      const DEFAULT_PATTERNS = ["data-[-a-z]+"];

      test("default patterns", function() {
        const htmlAttributeMangler = new HtmlAttributeMangler();
        const result = htmlAttributeMangler.options() as MangleOptions;
        expect(result).to.deep.include({ patterns: DEFAULT_PATTERNS });
      });

      test("custom pattern", function() {
        const pattern = "foo(bar|baz)-[a-z]+";

        const htmlAttributeMangler = new HtmlAttributeMangler({
          attrNamePattern: pattern,
        });
        const result = htmlAttributeMangler.options() as MangleOptions;
        expect(result).to.deep.include({ patterns: pattern });
      });

      test("custom patterns", function() {
        const patterns: string[] = ["foobar-[a-z]+", "foobar-[0-9]+"];

        const htmlAttributeMangler = new HtmlAttributeMangler({
          attrNamePattern: patterns,
        });
        const result = htmlAttributeMangler.options() as MangleOptions;
        expect(result).to.deep.include({ patterns });
      });
    });

    suite("::ignoreAttrNamePattern", function() {
      const DEFAULT_PATTERNS: string[] = [];

      test("default patterns", function() {
        const htmlAttributeMangler = new HtmlAttributeMangler();
        const result = htmlAttributeMangler.options() as MangleOptions;
        expect(result).to.deep.include({ ignorePatterns: DEFAULT_PATTERNS });
      });

      test("one custom pattern", function() {
        const ignorePatterns = "foo(bar|baz)-[a-z]+";

        const htmlAttributeMangler = new HtmlAttributeMangler({
          ignoreAttrNamePattern: ignorePatterns,
        });
        const result = htmlAttributeMangler.options() as MangleOptions;
        expect(result).to.deep.include({ ignorePatterns });
      });

      test("multiple custom patterns", function() {
        const ignorePatterns: string[] = ["foobar-[a-z]+", "foobar-[0-9]+"];

        const htmlAttributeMangler = new HtmlAttributeMangler({
          ignoreAttrNamePattern: ignorePatterns,
        });
        const result = htmlAttributeMangler.options() as MangleOptions;
        expect(result).to.deep.include({ ignorePatterns });
      });
    });

    suite("::reservedAttrNames", function() {
      test("default reserved", function() {
        const htmlAttributeMangler = new HtmlAttributeMangler();
        const result = htmlAttributeMangler.options() as MangleOptions;
        expect(result).to.have.property("reservedNames").that.is.not.empty;
      });

      test("custom reserved", function() {
        const reserved: string[] = ["foo", "bar"];

        const htmlAttributeMangler = new HtmlAttributeMangler({
          reservedAttrNames: reserved,
        });

        const result = htmlAttributeMangler.options() as MangleOptions;
        expect(result).to.have.property("reservedNames");

        const reservedNames = Array.from(result.reservedNames as string[]);
        expect(reservedNames).to.include.members(reserved);
      });
    });

    suite("::keepAttrPrefix", function() {
      const DEFAULT_MANGLE_PREFIX = "data-";

      test("default prefix", function() {
        const htmlAttributeMangler = new HtmlAttributeMangler();
        const result = htmlAttributeMangler.options() as MangleOptions;
        expect(result).to.deep.include({ manglePrefix: DEFAULT_MANGLE_PREFIX });
      });

      test("custom prefix", function() {
        const prefix = "foobar";

        const htmlAttributeMangler = new HtmlAttributeMangler({
          keepAttrPrefix: prefix,
        });
        const result = htmlAttributeMangler.options() as MangleOptions;
        expect(result).to.deep.include({ manglePrefix: prefix });
      });
    });
  });
});
