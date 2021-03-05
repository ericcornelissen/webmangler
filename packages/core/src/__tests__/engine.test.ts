import type { TestScenario } from "@webmangler/testing";
import type { CharSet } from "../characters";
import type { MangleExpression, WebManglerFile } from "../types";

import { expect } from "chai";

import MangleExpressionMock from "../__mocks__/mangle-expression.mock";
import WebManglerFileMock from "../__mocks__/web-mangler-file.mock";

import engine from "../engine";

interface TestCase {
  description?: string;
  expected: WebManglerFile[];
  expressions: Map<string, MangleExpression[]>;
  files: WebManglerFile[];
  patterns: string | string[];
  charSet?: CharSet;
  reservedNames?: string[];
  manglePrefix?: string;
  id?: string;
}

suite("ManglerEngine", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "one file",
      cases: [
        {
          files: [new WebManglerFileMock("css", ".foo { } #bar { }")],
          expected: [new WebManglerFileMock("css", ".a { } #bar { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".foo { } .cls-bar { }")],
          expected: [new WebManglerFileMock("css", ".foo { } .a { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "cls-[a-z]+",
        },
      ],
    },
    {
      name: "multiple file",
      cases: [
        {
          files: [
            new WebManglerFileMock("css", ".foo { }"),
            new WebManglerFileMock("css", "#bar { }"),
          ],
          expected: [
            new WebManglerFileMock("css", ".a { }"),
            new WebManglerFileMock("css", "#bar { }"),
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            new WebManglerFileMock("css", ".foo { }"),
            new WebManglerFileMock("css", ".bar { }"),
          ],
          expected: [
            new WebManglerFileMock("css", ".a { }"),
            new WebManglerFileMock("css", ".b { }"),
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            new WebManglerFileMock("css", ".foo { }"),
            new WebManglerFileMock("css", ".foo { } .bar { }"),
          ],
          expected: [
            new WebManglerFileMock("css", ".a { }"),
            new WebManglerFileMock("css", ".a { } .b { }"),
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            new WebManglerFileMock("css", ".foo { }"),
            new WebManglerFileMock("html", "<div class=\"cls-foo cls-bar\">"),
          ],
          expected: [
            new WebManglerFileMock("css", ".a { }"),
            new WebManglerFileMock("html", "<div class=\"cls-a cls-b\">"),
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
            ["html", [new MangleExpressionMock("cls-(%s)", 1, "cls-%s")]],
          ]),
          patterns: "[a-z]+",
        },
      ],
    },
    {
      name: "custom character set",
      cases: [
        {
          files: [new WebManglerFileMock("css", ".another, .one, .bites, .de_dust { }")],
          expected: [new WebManglerFileMock("css", ".a, .b, .c, .aa { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z_]+",
          charSet: ["a", "b", "c"],
        },
        {
          files: [new WebManglerFileMock("css", ".another, .one, .bites, .de_dust { }")],
          expected: [new WebManglerFileMock("css", ".c, .b, .a, .cc { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z_]+",
          charSet: ["c", "b", "a"],
        },
        {
          files: [new WebManglerFileMock("css", ".foo { } .bar { }")],
          expected: [new WebManglerFileMock("css", ".x { } .xx { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
          charSet: ["x"],
        },
      ],
    },
    {
      name: "reserved names",
      cases: [
        {
          files: [new WebManglerFileMock("css", ".foo { } .bar { }")],
          expected: [new WebManglerFileMock("css", ".a { } .c { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
          reservedNames: ["b"],
        },
        {
          files: [new WebManglerFileMock("css", ".foo { }")],
          expected: [new WebManglerFileMock("css", ".c { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
          reservedNames: ["a", "b"],
        },
      ],
    },
    {
      name: "mangling prefix",
      cases: [
        {
          files: [new WebManglerFileMock("css", ".foo { } .bar { }")],
          expected: [new WebManglerFileMock("css", ".cls-a { } .cls-b { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
          manglePrefix: "cls-",
        },
      ],
    },
    {
      name: "reserved names & mangling prefix",
      cases: [
        {
          files: [new WebManglerFileMock("css", ".foo { } .bar { }")],
          expected: [new WebManglerFileMock("css", ".cls-b { } .cls-c { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
          reservedNames: ["a"],
          manglePrefix: "cls-",
        },
      ],
    },
    {
      name: "input files not supported",
      cases: [
        {
          files: [new WebManglerFileMock("css", ".foo { }")],
          expected: [],
          expressions: new Map(),
          patterns: "",
        },
        {
          files: [
            new WebManglerFileMock("css", ".foo { }"),
            new WebManglerFileMock("html", "<p>Hello world!</p>"),
          ],
          expected: [
            new WebManglerFileMock("css", ".foo { }"),
          ],
          expressions: new Map([
            ["css", []],
          ]),
          patterns: "",
        },
        {
          files: [
            new WebManglerFileMock("css", ".foo { }"),
            new WebManglerFileMock("html", "<p>Hello world!</p>"),
          ],
          expected: [
            new WebManglerFileMock("html", "<p>Hello world!</p>"),
          ],
          expressions: new Map([
            ["html", []],
          ]),
          patterns: "",
        },
      ],
    },
    {
      name: "mangles based on frequency",
      cases: [
        {
          files: [new WebManglerFileMock("css", ".foo, .bar { } .bar { }")],
          expected: [new WebManglerFileMock("css", ".b, .a { } .a { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
      ],
    },
    {
      name: "strings to mangle intersect with mangled string",
      cases: [
        {
          files: [new WebManglerFileMock("css", ".a, .b { }")],
          expected: [new WebManglerFileMock("css", ".a, .b { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".c, .a { }")],
          expected: [new WebManglerFileMock("css", ".a, .b { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".b, .a { }")],
          expected: [new WebManglerFileMock("css", ".a, .b { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".b, .a, .z { } .a.b { }")],
          expected: [new WebManglerFileMock("css", ".a, .b, .c { } .b.a { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".b, .z, .a { } .a.b { }")],
          expected: [new WebManglerFileMock("css", ".a, .c, .b { } .b.a { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".z, .b, .a { } .a.b { }")],
          expected: [new WebManglerFileMock("css", ".c, .a, .b { } .b.a { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".b, .a, .x, .y { }")],
          expected: [new WebManglerFileMock("css", ".a, .b, .c, .d { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".b, .a, .c, .d { }")],
          expected: [new WebManglerFileMock("css", ".a, .b, .c, .d { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".d, .c, .b, .a { }")],
          expected: [new WebManglerFileMock("css", ".a, .b, .c, .d { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".c, .d, .b, .a { }")],
          expected: [new WebManglerFileMock("css", ".a, .b, .c, .d { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".x, .a, .b { }")],
          expected: [new WebManglerFileMock("css", ".a, .b, .c { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
      ],
    },
    {
      name: "corner cases",
      cases: [
        {
          files: [new WebManglerFileMock("css", ".a { }")],
          expected: [new WebManglerFileMock("css", ".a { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
          description: "no changes expected if source is already mangled",
        },
        {
          files: [new WebManglerFileMock("css", ".b { } .a { }")],
          expected: [new WebManglerFileMock("css", ".a { } .b { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
          description: "mangled source may be re-mangled",
        },
        {
          files: [new WebManglerFileMock("css", ".a-a { }")],
          expected: [new WebManglerFileMock("css", ".a { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z-]+",
          description: "potential unique prefix can appear in source",
        },
      ],
    },
  ];

  for (const { name, cases } of scenarios) {
    test(name, function() {
      for (const testCase of cases) {
        const {
          expected,
          description: failureMessage,
          expressions,
          files,
        } = testCase;

        const result = engine(files, expressions, {
          charSet: testCase.charSet,
          patterns: testCase.patterns,
          reservedNames: testCase.reservedNames,
          manglePrefix: testCase.manglePrefix,
        });
        expect(result).to.deep.equal(expected, failureMessage);
      }
    });
  }
});
