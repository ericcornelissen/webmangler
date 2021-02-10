import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "./types";

import { expect } from "chai";

import {
  ATTRIBUTE_SELECTORS,
  PSEUDO_ELEMENT_SELECTORS,
  PSEUDO_SELECTORS,
} from "./css-selectors";
import {
  getArrayOfFormattedStrings,
  isValidClassName,
  varyQuotes,
  varySpacing,
} from "./test-helpers";

import ManglerFileMock from "../../__mocks__/mangler-file.mock";

import BuiltInLanguageSupport from "../../languages/builtin";
import mangleEngine from "../../engine";
import CssClassMangler from "../css-classes";

const builtInLanguageSupport = new BuiltInLanguageSupport();

suite("CSS Classes Mangler", function() {
  const DEFAULT_PATTERN = "cls[-_][a-zA-Z-_]+";

  suite("CSS", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "individual selectors",
        cases: [
          { input: ".cls-foo{ }", expected: ".a{ }" },
          { input: ".cls-foo { }", expected: ".a { }" },
          { input: ".foo { }", expected: ".foo { }" },
          { input: "div { }", expected: "div { }" },
          { input: "#cls-foo { }", expected: "#cls-foo { }" },
          { input: "#foo { }", expected: "#foo { }" },
          { input: ":root { }", expected: ":root { }" },
        ],
      },
      {
        name: "class with pseudo selectors",
        cases: [
          ...PSEUDO_SELECTORS.map((s: string): TestCase => ({
            input: `.cls-foo:${s} { }`,
            expected: `.a:${s} { }`,
          })),
          ...PSEUDO_ELEMENT_SELECTORS.map((s: string): TestCase => ({
            input: `.cls-foo::${s} { }`,
            expected: `.a::${s} { }`,
          })),
        ],
      },
      {
        name: "class with attribute selectors",
        cases: [
          ...ATTRIBUTE_SELECTORS.map((s: string): TestCase => ({
            input: `.cls-foo[${s}] { }`,
            expected: `.a[${s}] { }`,
          })),
        ],
      },
      {
        name: "inverted class selectors",
        cases: [
          ...varySpacing(["(", ")"], {
            input: ":not(.cls-foo) { }",
            expected: ":not(.a) { }",
          }),
        ],
      },
      {
        name: "or selectors",
        cases: [
          ...varySpacing(",", {
            input: "div,.cls-foo { }",
            expected: "div,.a { }",
          }),
          ...varySpacing(",", {
            input: ".cls-foo,span { }",
            expected: ".a,span { }",
          }),
          ...varySpacing(",", {
            input: "div,.cls-foo,span { }",
            expected: "div,.a,span { }",
          }),
        ],
      },
      {
        name: "and selectors",
        cases: [
          { input: "div.cls-foo { }", expected: "div.a { }" },
          { input: "#foo.cls-bar { }", expected: "#foo.a { }" },
          { input: "#cls-foo.cls-bar { }", expected: "#cls-foo.a { }" },
          { input: ".cls-foo.cls-bar { }", expected: ".a.b { }" },
          { input: "div#foo.cls-bar { }", expected: "div#foo.a { }" },
        ],
      },
      {
        name: "descendent selectors",
        cases: [
          { input: "div .cls-foo { }", expected: "div .a { }" },
          { input: "#foo .cls-bar { }", expected: "#foo .a { }" },
          { input: "#cls-foo .cls-bar { }", expected: "#cls-foo .a { }" },
          { input: ".cls-foo div { }", expected: ".a div { }" },
          { input: ".cls-foo #bar { }", expected: ".a #bar { }" },
          { input: ".cls-foo #cls-bar { }", expected: ".a #cls-bar { }" },
          { input: ".cls-foo .cls-bar { }", expected: ".a .b { }" },
        ],
      },
      {
        name: "child selectors",
        cases: [
          ...varySpacing(">", {
            input: "div>.cls-foo { }",
            expected: "div>.a { }",
          }),
          ...varySpacing(">", {
            input: ".cls-foo>div { }",
            expected: ".a>div { }",
          }),
        ],
      },
      {
        name: "sibling selectors",
        cases: [
          ...varySpacing("+", {
            input: "div+.cls-foo { }",
            expected: "div+.a { }",
          }),
          ...varySpacing("+", {
            input: ".cls-foo+div { }",
            expected: ".a+div { }",
          }),
        ],
      },
      {
        name: "preceded selectors",
        cases: [
          ...varySpacing("~", {
            input: "div~.cls-foo { }",
            expected: "div~.a { }",
          }),
          ...varySpacing("~", {
            input: ".cls-foo~div { }",
            expected: ".a~div { }",
          }),
        ],
      },
      {
        name: "multiple classes",
        cases: [
          {
            input: ".cls-foo { } .cls-bar { }",
            expected: ".a { } .b { }",
          },
        ],
      },
      {
        name: "repeated classes",
        cases: [
          {
            input: ".cls-foo { } .cls-foo { }",
            expected: ".a { } .a { }",
          },
          {
            input: ".cls-foo { } #bar.cls-foo { }",
            expected: ".a { } #bar.a { }",
          },
          {
            input: ".cls-foo { } #bar.cls-foo { } div .cls-foo { }",
            expected: ".a { } #bar.a { } div .a { }",
          },
        ],
      },
      {
        name: "classes sharing names with other selectors",
        cases: [
          {
            input: "div { } .div { }",
            expected: "div { } .a { }",
            pattern: "[a-zA-Z-]+",
          },
          {
            input: "#foo { } .foo { }",
            expected: "#foo { } .a { }",
            pattern: "[a-zA-Z-]+",
          },
          ...ATTRIBUTE_SELECTORS
            .filter(isValidClassName)
            .map((s: string): TestCase => {
              return {
                input: `div[${s}] { } .${s} { }`,
                expected: `div[${s}] { } .a { }`,
                pattern: "[a-zA-Z-]+",
              };
            }),
          ...PSEUDO_SELECTORS
            .filter(isValidClassName)
            .map((s: string): TestCase => {
              return {
                input: `input:${s} { } .${s} { }`,
                expected: `input:${s} { } .a { }`,
                pattern: "[a-zA-Z-]+",
              };
            }),
          ...PSEUDO_ELEMENT_SELECTORS
            .filter(isValidClassName)
            .map((s: string): TestCase => {
              return {
                input: `div::${s} { } .${s} { }`,
                expected: `div::${s} { } .a { }`,
                pattern: "[a-zA-Z-]+",
              };
            }),
        ],
      },
      {
        name: "reserved class names",
        cases: [
          {
            input: ".cls-foo { }",
            reserved: ["a"],
            expected: ".b { }",
          },
          {
            input: ".cls-foo { }",
            reserved: ["a", "b", "c"],
            expected: ".d { }",
          },
          {
            input: ".cls-foo { } .cls-bar { }",
            reserved: ["b"],
            expected: ".a { } .c { }",
          },
          {
            input: ".cls-foo { } #bar { } div.cls-praise { } .cls-the, .cls-sun { }",
            reserved: ["b", "d"],
            expected: ".a { } #bar { } div.c { } .e, .f { }",
          },
        ],
      },
      {
        name: "prefixed mangling",
        cases: [
          {
            input: ".cls-foo { }",
            prefix: "mangled-",
            expected: ".mangled-a { }",
          },
          {
            input: ".cls-foo { } .cls-bar { }",
            prefix: "cls-",
            expected: ".cls-a { } .cls-b { }",
          },
          {
            input: ".foo-bar { } .foo-baz { }",
            pattern: "foo-[a-z]+",
            prefix: "foo-",
            expected: ".foo-a { } .foo-b { }",
          },
        ],
      },
      {
        name: "input classes and mangled classes intersect",
        cases: [
          {
            input: ".a { } .b { }",
            expected: ".a { } .b { }",
            pattern: "[a-z]",
          },
          {
            input: ".b { } .a { }",
            expected: ".a { } .b { }",
            pattern: "[a-z]",
          },
          {
            input: ".a, .c, .b { }",
            expected: ".a, .b, .c { }",
            pattern: "[a-z]",
          },
          {
            input: ".d, .c, .b, .a { }",
            expected: ".a, .b, .c, .d { }",
            pattern: "[a-z]",
          },
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            input: ".cls-foo[href$=\".bar\"]",
            expected: ".a[href$=\".bar\"]",
            description: `
              The ".bar" value used in the href attribute selector, checking
              for hrefs ending with the ".bar" extension, should not be mangled.
            `,
          },
          {
            input: ".cls-a.cls-a.cls-b.cls-b#cls-a.cls-a.cls-b.cls-b { }",
            expected: ".b.b.a.a#cls-a.b.a.a { }",
            description: `
              Repeated classes in a single selector, although meaningless,
              should be handled correctly.
            `,
          },
          {
            input: ".cls-foo",
            expected: ".cls-foo",
            description: "Unclear what should happen with dangling classes...",
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            input,
            expected,
            pattern: classNamePattern,
            reserved: reservedClassNames,
            prefix: keepClassNamePrefix,
            description: failureMessage,
          } = testCase;

          const cssClassMangler = new CssClassMangler({
            classNamePattern: classNamePattern || DEFAULT_PATTERN,
            reservedClassNames: reservedClassNames,
            keepClassNamePrefix: keepClassNamePrefix,
          });
          cssClassMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("css", input)];
          const result = cssClassMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("HTML", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "single class",
        cases: [
          ...varySpacing("=", {
            input: "<div class=\"cls-foo\">",
            expected: "<div class=\"a\">",
          }),
          ...varyQuotes("html", {
            input: "<div class=\"cls-bar\">",
            expected: "<div class=\"a\">",
          }),
          ...varyQuotes("html", {
            input: `
              <div class="cls-foo"></div>
              <div class="cls-bar"></div>
            `,
            expected: `
              <div class="a"></div>
              <div class="b"></div>
            `,
          }),
          ...varyQuotes("html", {
            input: `
              <div class="cls-foo">
                <div class="cls-bar"></div>
              </div>
            `,
            expected: `
              <div class="a">
                <div class="b"></div>
              </div>
            `,
          }),
        ],
      },
      {
        name: "multiple classes",
        cases: [
          ...varyQuotes("html", {
            input: "<div class=\"cls-foo cls-bar\">",
            expected: "<div class=\"a b\">",
          }),
          {
            input: "<div class=\"cls-foo bar\">",
            expected: "<div class=\"a bar\">",
          },
          {
            input: "<div class=\"foo cls-bar\">",
            expected: "<div class=\"foo a\">",
          },
          {
            input: "<div class=\"cls-praise cls-the cls-sun\">",
            expected: "<div class=\"a b c\">",
          },
          {
            input: "<div class=\"cls-praise test cls-the test cls-sun\">",
            expected: "<div class=\"a test b test c\">",
          },
          {
            input: "<div class=\"test cls-praise test cls-the test cls-sun test\">",
            expected: "<div class=\"test a test b test c test\">",
          },
          {
            input: `
              <div class="cls-praise cls-the"></div>
              <div class="cls-sun"></div>
            `,
            expected: `
              <div class="a b"></div>
              <div class="c"></div>
            `,
          },
          {
            input: `
              <div class="cls-praise"></div>
              <div class="cls-the cls-sun"></div>
            `,
            expected: `
              <div class="a"></div>
              <div class="b c"></div>
            `,
          },
          {
            input: `
              <div class="cls-foo cls-bar"></div>
              <div class="cls-foo"></div>
            `,
            expected: `
              <div class="a b"></div>
              <div class="a"></div>
            `,
          },
          {
            input: `
              <div class="cls-praise cls-the">
                <div class="cls-sun"></div>
              </div>
            `,
            expected: `
              <div class="a b">
                <div class="c"></div>
              </div>
            `,
          },
          {
            input: `
              <div class="cls-praise">
                <div class="cls-the cls-sun"></div>
              </div>
            `,
            expected: `
              <div class="a">
                <div class="b c"></div>
              </div>
            `,
          },
          {
            input: `
              <div class="cls-foo cls-bar">
                <div class="cls-foo"></div>
              </div>
            `,
            expected: `
              <div class="a b">
                <div class="a"></div>
              </div>
            `,
          },
        ],
      },
      {
        name: "multiple attributes (preceding)",
        cases: [
          ...varyQuotes("html", {
            input: "<div id=\"bar\" class=\"cls-foo\">",
            expected: "<div id=\"bar\" class=\"a\">",
          }),
        ],
      },
      {
        name: "multiple attributes (succeeding)",
        cases: [
          ...varyQuotes("html", {
            input: "<a class=\"cls-foo\" href=\"https://example.com/\">",
            expected: "<a class=\"a\" href=\"https://example.com/\">",
          }),
        ],
      },
      {
        name: "multiple attributes (surrounding)",
        cases: [
          ...varyQuotes("html", {
            input: "<div id=\"bar\" class=\"cls-foo\" data-attr=\"value\">",
            expected: "<div id=\"bar\" class=\"a\" data-attr=\"value\">",
          }),
        ],
      },
      {
        name: "non-class attributes",
        cases: [
          ...varyQuotes("html", {
            input: "<div id=\"cls-foo\">",
            expected: "<div id=\"cls-foo\">",
          }),
          ...varyQuotes("html", {
            input: "<div clss=\"cls-foo\">",
            expected: "<div clss=\"cls-foo\">",
            description: "Attributes similar to 'class' should be are ignored",
          }),
        ],
      },
      {
        name: "reserved class names",
        cases: [
          {
            input: "<div class=\"cls-foo\">",
            reserved: ["a"],
            expected: "<div class=\"b\">",
          },
          {
            input: "<div class=\"cls-foo\">",
            reserved: ["a", "b", "c"],
            expected: "<div class=\"d\">",
          },
          {
            input: "<div class=\"cls-foo cls-bar\">",
            reserved: ["b"],
            expected: "<div class=\"a c\">",
          },
          {
            input: "<div class=\"cls-correct cls-horse cls-battery cls-staple\">",
            reserved: ["b", "d"],
            expected: "<div class=\"a c e f\">",
          },
        ],
      },
      {
        name: "prefixed mangling",
        cases: [
          {
            input: "<div class=\"cls-foo\">",
            prefix: "mangled-",
            expected: "<div class=\"mangled-a\">",
          },
          {
            input: "<div class=\"cls-foo cls-bar\">",
            prefix: "cls-",
            expected: "<div class=\"cls-a cls-b\">",
          },
          {
            input: "<div class=\"foo-bar foo-baz\">",
            pattern: "foo-[a-z]+",
            prefix: "foo-",
            expected: "<div class=\"foo-a foo-b\">",
          },
        ],
      },
      {
        name: "input classes and mangled classes intersect",
        cases: [
          {
            input: "<div class=\"a b\">",
            pattern: "[a-z]",
            expected: "<div class=\"a b\">",
          },
          {
            input: "<div class=\"b a\">",
            pattern: "[a-z]",
            expected: "<div class=\"a b\">",
          },
          {
            input: "<div class=\"a c b\">",
            pattern: "[a-z]",
            expected: "<div class=\"a b c\">",
          },
          {
            input: "<div class=\"d c b e\">",
            pattern: "[a-z]",
            expected: "<div class=\"a b c d\">",
          },
          {
            input: "<div class=\"o m foo n\">",
            pattern: "[a-z]",
            expected: "<div class=\"a b foo c\">",
            description: "the single o class should not be replaced in 'foo'",
          },
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            input: "<div class=\"cls-foo$\">",
            expected: "<div class=\"cls-foo$\">",
            description: "Shouldn't mangle if the class name does not match as word.",
          },
          {
            input: "<div class=\"cls-foo cls-foo cls-bar cls-foo ignore\">",
            expected: "<div class=\"a a b a ignore\">",
            description: `
              Repeated classes in a single class attribute, although
              meaningless, should be handled correctly.
            `,
          },
          {
            input: "<p>cls-foo</p>",
            expected: "<p>cls-foo</p>",
            description: "Anything inside tags matching the pattern should be ignored.",
          },
          {
            input: "<p>.cls-foo</p>",
            expected: "<p>.cls-foo</p>",
            description: "Anything inside tags matching the pattern should be ignored.",
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            input,
            expected,
            pattern: classNamePattern,
            reserved: reservedClassNames,
            prefix: keepClassNamePrefix,
            description: failureMessage,
          } = testCase;

          const cssClassMangler = new CssClassMangler({
            classNamePattern: classNamePattern || DEFAULT_PATTERN,
            reservedClassNames: reservedClassNames,
            keepClassNamePrefix: keepClassNamePrefix,
          });
          cssClassMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("html", input)];
          const result = cssClassMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("JavaScript", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "single class",
        cases: [
          ...varyQuotes("js", {
            input: "$el.classList.add(\"cls-foo\");",
            expected: "$el.classList.add(\"a\");",
          }),
          ...varyQuotes("js", {
            input: "var bar = \"cls-foo\";",
            expected: "var bar = \"a\";",
            description: `
              The class may appear by itself in a string ,e.g. for a call to
              \`element.classList.add\`. As the string for this may be a
              reference, class name should be replaced everywhere if the string
              is just the class (and whitespace).
            `,
          }),
          ...varyQuotes("js", {
            input: "document.querySelectorAll(\".cls-foo\");",
            expected: "document.querySelectorAll(\".a\");",
          }),
          ...varyQuotes("js", {
            input: "var bar = \".cls-foo\";",
            expected: "var bar = \".a\";",
            description: `
              The class may appear in a string provided it is preceded by a dot
              (.), e.g. for a call to \`document.querySelector\`. As the string
              for this may be a reference, this pattern should also be detected
              in other strings.
            `,
          }),
          ...varyQuotes("js", {
            input: `
              var foo = document.querySelector(".cls-foo");
              var bar = document.querySelector(".cls-bar");
            `,
            expected: `
              var foo = document.querySelector(".a");
              var bar = document.querySelector(".b");
            `,
          }),
        ],
      },
      {
        name: "and selectors",
        cases: [
          {
            input: "var foo = \"div.cls-bar\"",
            expected: "var foo = \"div.a\"",
          },
          {
            input: "var foobar = \"#foo.cls-bar\"",
            expected: "var foobar = \"#foo.a\"",
          },
          {
            input: "var foobar = \"#cls-foo.cls-bar\"",
            expected: "var foobar = \"#cls-foo.a\"",
          },
          {
            input: "var foobar = \".cls-foo.cls-bar\"",
            expected: "var foobar = \".a.b\"",
          },
          {
            input: "var foobar = \"div#foo.cls-bar\"",
            expected: "var foobar = \"div#foo.a\"",
          },
        ],
      },
      {
        name: "descendent selectors",
        cases: [
          {
            input: "var foo = \"div .cls-bar\"",
            expected: "var foo = \"div .a\"",
          },
          {
            input: "var foobar = \"#foo .cls-bar\"",
            expected: "var foobar = \"#foo .a\"",
          },
          {
            input: "var foobar = \"#cls-foo .cls-bar\"",
            expected: "var foobar = \"#cls-foo .a\"",
          },
          {
            input: "var bar = \".cls-foo div\"",
            expected: "var bar = \".a div\"",
          },
          {
            input: "var foobar = \".cls-foo #bar\"",
            expected: "var foobar = \".a #bar\"",
          },
          {
            input: "var foobar = \".cls-foo #cls-bar\"",
            expected: "var foobar = \".a #cls-bar\"",
          },
          {
            input: "var foobar = \".cls-foo .cls-bar\"",
            expected: "var foobar = \".a .b\"",
          },
        ],
      },
      {
        name: "child selectors",
        cases: [
          ...varySpacing(">", {
            input: "var foo = \"div>.cls-bar\"",
            expected: "var foo = \"div>.a\"",
          }),
          ...varySpacing(">", {
            input: "var foo = \".cls-bar>div\"",
            expected: "var foo = \".a>div\"",
          }),
        ],
      },
      {
        name: "sibling selectors",
        cases: [
          ...varySpacing("+", {
            input: "var foo = \"div+.cls-bar\"",
            expected: "var foo = \"div+.a\"",
          }),
          ...varySpacing("+", {
            input: "var foo = \".cls-bar+div\"",
            expected: "var foo = \".a+div\"",
          }),
        ],
      },
      {
        name: "preceded selectors",
        cases: [
          ...varySpacing("~", {
            input: "var foo = \"div~.cls-bar\"",
            expected: "var foo = \"div~.a\"",
          }),
          ...varySpacing("~", {
            input: "var foo = \".cls-bar~div\"",
            expected: "var foo = \".a~div\"",
          }),
        ],
      },
      {
        name: "multiple classes",
        cases: [
          ...varyQuotes("js", {
            input: "var foobar = \".cls-foo .cls-bar\";",
            expected: "var foobar = \".a .b\";",
          }),
          ...varyQuotes("js", {
            input: "var foobar = \".cls-foo.cls-bar\";",
            expected: "var foobar = \".a.b\";",
          }),
          ...varyQuotes("js", {
            input: "var foo = \".cls-foo\", bar = \".cls-foo.cls-bar\";",
            expected: "var foo = \".a\", bar = \".a.b\";",
          }),
        ],
      },
      {
        name: "non-class selectors",
        cases: [
          ...varyQuotes("js", {
            input: "var idSelector = \"#cls-foo\";",
            expected: "var idSelector = \"#cls-foo\";",
          }),
          ...varyQuotes("js", {
            input: "var elementSelector = \"cls_foo.cls-bar\";",
            expected: "var elementSelector = \"cls_foo.a\";",
          }),
          ...varyQuotes("js", {
            input: "var attributeSelector = \"div[cls-foo]\";",
            expected: "var attributeSelector = \"div[cls-foo]\";",
          }),
          ...varyQuotes("js", {
            input: "var attributeSelector = \".cls-foo[cls-foo]\";",
            expected: "var attributeSelector = \".a[cls-foo]\";",
          }),
        ],
      },
      {
        name: "input classes and mangled classes intersect",
        cases: [
          {
            input: "var foo = \".a .b\";",
            pattern: "[a-z]",
            expected: "var foo = \".a .b\";",
          },
          {
            input: "var foo = \"a\", bar = \"b\";",
            pattern: "[a-z]",
            expected: "var foo = \"a\", bar = \"b\";",
          },
          {
            input: "var foo = \".b .a\";",
            pattern: "[a-z]",
            expected: "var foo = \".a .b\";",
          },
          {
            input: "var foo = \"b\", bar = \"a\";",
            pattern: "[a-z]",
            expected: "var foo = \"a\", bar = \"b\";",
          },
          {
            input: "var foo = \".a .c .b\";",
            pattern: "[a-z]",
            expected: "var foo = \".a .b .c\";",
          },
          {
            input: "var foo = \".d .c .b .a\";",
            pattern: "[a-z]",
            expected: "var foo = \".a .b .c .d\";",
          },
        ],
      },
      {
        name: "corner cases",
        cases: [
          ...varyQuotes("js", {
            input: "var cls_foo = \"cls-foo\";",
            expected: "var cls_foo = \"a\";",
            description: `
              Anything outside quotation marks matching the pattern should be
              ignored.
            `,
          }),
          ...varyQuotes("js", {
            input: "var x = \"foo cls-foo bar\";",
            expected: "var x = \"foo cls-foo bar\";",
            description: `
              In multi-word strings, anything matching the pattern without a
              leading dot (".") should not be mangled.
            `,
          }),
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            input,
            expected,
            pattern: classNamePattern,
            reserved: reservedClassNames,
            prefix: keepClassNamePrefix,
            description: failureMessage,
          } = testCase;

          const cssClassMangler = new CssClassMangler({
            classNamePattern: classNamePattern || DEFAULT_PATTERN,
            reservedClassNames: reservedClassNames,
            keepClassNamePrefix: keepClassNamePrefix,
          });
          cssClassMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("js", input)];
          const result = cssClassMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("Illegal names", function() {
    const illegalNames: string[] = [
      ".-",
    ];

    let content = "";

    suiteSetup(function() {
      const n = CssClassMangler.CHARACTER_SET.length;
      const nArray = getArrayOfFormattedStrings(n, ".cls-%s");
      content = `${nArray.join(",")} { }`;
    });

    test("without extra reserved", function() {
      const cssClassMangler = new CssClassMangler({
        classNamePattern: "cls-[0-9]+",
      });
      cssClassMangler.use(builtInLanguageSupport);

      const file = new ManglerFileMock("css", content);
      const result = cssClassMangler.mangle(mangleEngine, [file]);
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });

    test("with extra reserved", function() {
      const cssClassMangler = new CssClassMangler({
        classNamePattern: "cls-[0-9]+",
        reservedClassNames: ["a"],
      });
      cssClassMangler.use(builtInLanguageSupport);

      const file = new ManglerFileMock("css", content);
      const result = cssClassMangler.mangle(mangleEngine, [file]);
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });
  });

  test("no input files", function() {
    const cssClassMangler = new CssClassMangler({
      classNamePattern: DEFAULT_PATTERN,
    });

    const result = cssClassMangler.mangle(mangleEngine, []);
    expect(result).to.have.lengthOf(0);
  });
});
