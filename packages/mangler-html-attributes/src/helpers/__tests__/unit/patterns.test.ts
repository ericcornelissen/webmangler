import { expect } from "chai";

import {
  getIgnorePatterns,
  getPatterns,
} from "../../patterns";

suite("HTML Attribute Mangler pattern helpers", function() {
  suite("::getIgnorePatterns", function() {
    const DEFAULT_PATTERNS: string[] = [];

    test("default patterns", function() {
      const result = getIgnorePatterns({ });
      expect(result).to.deep.equal(DEFAULT_PATTERNS);
    });

    test("one custom pattern", function() {
      const ignoreAttrNamePattern = "foo(bar|baz)-[a-z]+";

      const result = getIgnorePatterns({ ignoreAttrNamePattern });
      expect(result).to.equal(ignoreAttrNamePattern);
    });

    test("multiple custom patterns", function() {
      const ignoreAttrNamePattern: string[] = [
        "foobar-[a-z]+",
        "foobar-[0-9]+",
      ];

      const result = getIgnorePatterns({ ignoreAttrNamePattern });
      expect(result).to.deep.equal(ignoreAttrNamePattern);
    });
  });

  suite("::getPatterns", function() {
    const DEFAULT_PATTERNS = ["data-[-a-z]+"];

    test("default patterns", function() {
      const result = getPatterns({ });
      expect(result).to.deep.equal(DEFAULT_PATTERNS);
    });

    test("one custom pattern", function() {
      const attrNamePattern = "foo(bar|baz)-[a-z]+";

      const result = getPatterns({ attrNamePattern });
      expect(result).to.equal(attrNamePattern);
    });

    test("multiple custom patterns", function() {
      const attrNamePattern: string[] = [
        "foobar-[a-z]+",
        "foobar-[0-9]+",
      ];

      const result = getPatterns({ attrNamePattern });
      expect(result).to.deep.equal(attrNamePattern);
    });
  });
});
