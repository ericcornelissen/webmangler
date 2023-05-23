import { expect } from "chai";

import {
  getIgnorePatterns,
  getPatterns,
} from "../../patterns";

suite("CSS Variable Mangler patterns helpers", function() {
  suite("::getIgnorePatterns", function() {
    const DEFAULT_PATTERNS: string[] = [];

    test("default patterns", function() {
      const result = getIgnorePatterns({ });
      expect(result).to.deep.equal(DEFAULT_PATTERNS);
    });

    test("one custom pattern", function() {
      const ignorePattern = "foo(bar|baz)-[a-z]+";

      const result = getIgnorePatterns({
        ignoreCssVarNamePattern: ignorePattern,
      });

      expect(result).to.equal(ignorePattern);
    });

    test("multiple custom patterns", function() {
      const ignorePatterns: string[] = [
        "foobar-[a-z]+",
        "foobar-[0-9]+",
      ];

      const result = getIgnorePatterns({
        ignoreCssVarNamePattern: ignorePatterns,
      });

      expect(result).to.deep.equal(ignorePatterns);
    });
  });

  suite("::getPatterns", function() {
    const DEFAULT_PATTERNS = ["[-A-Za-z]+"];

    test("default patterns", function() {
      const result = getPatterns({ });
      expect(result).to.deep.equal(DEFAULT_PATTERNS);
    });

    test("one custom pattern", function() {
      const patterns = "foo(bar|baz)-[a-z]+";

      const result = getPatterns({
        cssVarNamePattern: patterns,
      });

      expect(result).to.equal(patterns);
    });

    test("multiple custom patterns", function() {
      const patterns: string[] = [
        "foobar-[a-z]+",
        "foobar-[0-9]+",
      ];

      const result = getPatterns({
        cssVarNamePattern: patterns,
      });

      expect(result).to.deep.equal(patterns);
    });
  });
});
