import { expect } from "chai";

import {
  rewriteCharacterMatchers,
  rewriteCharacterRangeLowercase,
  rewriteCharacterRangeMixedCase,
  rewriteCharacterRangeUppercase,
} from "../../rewriters";

suite("Case insensitive rewriters", function() {
  interface TestCase {
    readonly pattern: string;
    readonly expected: string;
  }

  suite("::rewriteCharacterMatchers", function() {
    const testCases: TestCase[] = [
      {
        pattern: "a",
        expected: "[aA]",
      },
      {
        pattern: "foo",
        expected: "[fF][oO][oO]",
      },
      {
        pattern: "FOO",
        expected: "[fF][oO][oO]",
      },
      {
        pattern: "Hello+ world!",
        expected: "[hH][eE][lL][lL][oO]+ [wW][oO][rR][lL][dD]!",
      },
      {
        pattern: "(foo|bar)",
        expected: "([fF][oO][oO]|[bB][aA][rR])",
      },
      {
        pattern: "[abc]",
        expected: "[abc]",
      },
    ];

    for (const testCase of testCases) {
      const { pattern, expected } = testCase;
      test(`rewrite ${pattern}`, function() {
        const result = rewriteCharacterMatchers(pattern);
        expect(result).to.equal(expected);
      });
    }
  });

  suite("::rewriteCharacterRangeLowercase", function() {
    const testCases: TestCase[] = [
      {
        pattern: "[a-z]",
        expected: "[a-zA-Z]",
      },
      {
        pattern: "[^a-y]",
        expected: "[^a-yA-Y]",
      },
      {
        pattern: "[A-Z]",
        expected: "[A-Z]",
      },
      {
        pattern: "[X-c]",
        expected: "[X-c]",
      },
    ];

    for (const testCase of testCases) {
      const { pattern, expected } = testCase;
      test(`rewrite ${pattern}`, function() {
        const result = rewriteCharacterRangeLowercase(pattern);
        expect(result).to.equal(expected);
      });
    }
  });

  suite("::rewriteCharacterRangeMixedCase", function() {
    const testCases: TestCase[] = [
      {
        pattern: "[X-c]",
        expected: "[x-zX-Za-cA-C]",
      },
      {
        pattern: "[^X-d]",
        expected: "[^x-zX-Za-dA-D]",
      },
      {
        pattern: "[A-Z]",
        expected: "[A-Z]",
      },
      {
        pattern: "[a-z]",
        expected: "[a-z]",
      },
    ];

    for (const testCase of testCases) {
      const { pattern, expected } = testCase;
      test(`rewrite ${pattern}`, function() {
        const result = rewriteCharacterRangeMixedCase(pattern);
        expect(result).to.equal(expected);
      });
    }
  });

  suite("::rewriteCharacterRangeUppercase", function() {
    const testCases: TestCase[] = [
      {
        pattern: "[A-Z]",
        expected: "[a-zA-Z]",
      },
      {
        pattern: "[^A-Y]",
        expected: "[^a-yA-Y]",
      },
      {
        pattern: "[a-z]",
        expected: "[a-z]",
      },
      {
        pattern: "[X-c]",
        expected: "[X-c]",
      },
    ];

    for (const testCase of testCases) {
      const { pattern, expected } = testCase;
      test(`rewrite ${pattern}`, function() {
        const result = rewriteCharacterRangeUppercase(pattern);
        expect(result).to.equal(expected);
      });
    }
  });
});
