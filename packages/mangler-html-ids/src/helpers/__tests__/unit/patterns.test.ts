import { expect } from "chai";

import {
  getIgnorePatterns,
  getPatterns,
} from "../../patterns";

suite("HTML ID Mangler pattern helpers", function() {
  suite("::getIgnorePatterns", function() {
    const DEFAULT_IGNORE_PATTERNS: string[] = [];

    test("default patterns", function() {
      const result = getIgnorePatterns({ });
      expect(result).to.deep.equal(DEFAULT_IGNORE_PATTERNS);
    });

    test("one custom pattern", function() {
      const ignoreIdNamePattern = "foo(bar|baz)-[a-z]+";

      const result = getIgnorePatterns({ ignoreIdNamePattern });
      expect(result).to.equal(ignoreIdNamePattern);
    });

    test("multiple custom patterns", function() {
      const ignoreIdNamePattern: string[] = [
        "foobar-[a-z]+",
        "foobar-[0-9]+",
      ];

      const result = getIgnorePatterns({ ignoreIdNamePattern });
      expect(result).to.deep.equal(ignoreIdNamePattern);
    });
  });

  suite("::getPatterns", function() {
    const DEFAULT_PATTERNS = [
      "id-[-A-Z_a-z]+",
    ];

    test("default patterns", function() {
      const result = getPatterns({ });
      expect(result).to.deep.equal(DEFAULT_PATTERNS);
    });

    test("one custom pattern", function() {
      const idNamePattern = "foo(bar|baz)-[a-z]+";

      const result = getPatterns({ idNamePattern });
      expect(result).to.equal(idNamePattern);
    });

    test("multiple custom patterns", function() {
      const idNamePattern: string[] = [
        "foobar-[a-z]+",
        "foobar-[0-9]+",
      ];

      const result = getPatterns({ idNamePattern });
      expect(result).to.deep.equal(idNamePattern);
    });
  });
});
