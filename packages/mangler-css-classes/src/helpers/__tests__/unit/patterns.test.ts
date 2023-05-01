import { expect } from "chai";

import {
  getIgnorePatterns,
  getPatterns,
} from "../../patterns";

suite("CSS Class Mangler pattern helpers", function() {
  suite("::getIgnorePatterns", function() {
    const DEFAULT_PATTERNS: string[] = [];

    test("default patterns", function() {
      const result = getIgnorePatterns({ });
      expect(result).to.deep.equal(DEFAULT_PATTERNS);
    });

    test("one custom pattern", function() {
      const ignorePattern = "foo(bar|baz)-[a-z]+";

      const result = getIgnorePatterns({
        ignoreClassNamePattern: ignorePattern,
      });
      expect(result).to.equal(ignorePattern);
    });

    test("multiple custom patterns", function() {
      const ignorePatterns: string[] = [
        "foobar-[a-z]+",
        "foobar-[0-9]+",
      ];

      const result = getIgnorePatterns({
        ignoreClassNamePattern: ignorePatterns,
      });
      expect(result).to.deep.equal(ignorePatterns);
    });
  });

  suite("::getPatterns", function() {
    const DEFAULT_PATTERNS = ["cls-[-A-Z_a-z]+"];

    test("default patterns", function() {
      const result = getPatterns({ });
      expect(result).to.deep.equal(DEFAULT_PATTERNS);
    });

    test("one custom pattern", function() {
      const patterns = "foo(bar|baz)-[a-z]+";

      const result = getPatterns({
        classNamePattern: patterns,
      });
      expect(result).to.equal(patterns);
    });

    test("multiple custom patterns", function() {
      const patterns: string[] = [
        "foobar-[a-z]+",
        "foobar-[0-9]+",
      ];

      const result = getPatterns({
        classNamePattern: patterns,
      });
      expect(result).to.deep.equal(patterns);
    });
  });
});
