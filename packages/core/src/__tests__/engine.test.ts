import type { TestScenario } from "@webmangler/testing";
import type { CharSet } from "../characters";
import type { MangleExpression, WebManglerFile } from "../types";

import { MangleExpressionMock, WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

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
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".foo { } #bar { }", "[a-z]+")
                .returns(["foo"]),
              sinon.stub()
                .withArgs(".foo { } #bar { }", new Map([["foo", "a"]]))
                .returns(".a { } #bar { }"),
            )]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".foo { } .cls-bar { }")],
          expected: [new WebManglerFileMock("css", ".foo { } .a { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".foo { } .cls-bar { }", "cls-[a-z]+")
                .returns(["cls-bar"]),
              sinon.stub()
                .withArgs(".foo { } .cls-bar { }", new Map([["cls-bar", "a"]]))
                .returns(".foo { } .a { }"),
            )]],
          ]),
          patterns: "cls-[a-z]+",
        },
      ],
    },
    {
      name: "multiple files",
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
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .callsFake((content) => {
                  if (content === ".foo { }") {
                    return ["foo"];
                  }

                  return [];
                }),
              sinon.stub()
                .callsFake((content) => {
                  if (content === ".foo { }") {
                    return ".a { }";
                  } else if (content === "#bar { }") {
                    return "#bar { }";
                  }

                  return content;
                }),
            )]],
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
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .callsFake((content) => {
                  if (content === ".foo { }") {
                    return ["foo"];
                  } else if (content === ".bar { }") {
                    return ["bar"];
                  }
                }),
              sinon.stub()
                .callsFake((content) => {
                  if (content === ".foo { }") {
                    return ".a { }";
                  } else if (content === ".bar { }") {
                    return ".b { }";
                  }

                  return content;
                }),
            )]],
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
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .callsFake((content) => {
                  if (content === ".foo { }") {
                    return ["foo"];
                  } else if (content === ".foo { } .bar { }") {
                    return ["foo", "bar"];
                  }
                }),
              sinon.stub()
                .callsFake((content) => {
                  if (content === ".foo { }") {
                    return ".a { }";
                  } else if (content === ".foo { } .bar { }") {
                    return ".a { } .b { }";
                  }

                  return content;
                }),
            )]],
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
            new WebManglerFileMock("html", "<div class=\"b c\">"),
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".foo { }", "[a-z]+")
                .returns(["foo"]),
              sinon.stub()
                .withArgs(".foo { }", sinon.match.map)
                .returns(".a { }"),
            )]],
            ["html", [new MangleExpressionMock(
              sinon.stub()
                .withArgs("<div class=\"cls-foo cls-bar\">", "[a-z]+")
                .returns(["cls-foo", "cls-bar"]),
              sinon.stub()
                .withArgs("<div class=\"cls-foo cls-bar\">", sinon.match.map)
                .returns("<div class=\"b c\">"),
            )]],
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
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".another, .one, .bites, .de_dust { }", "[a-z_]+")
                .returns(["another", "one", "bites", "de_dust"]),
              sinon.stub()
                .withArgs(".another, .one, .bites, .de_dust { }", new Map([
                  ["another", "a"],
                  ["one", "b"],
                  ["bites", "c"],
                  ["de_dust", "aa"],
                ]))
                .returns(".a, .b, .c, .aa { }"),
            )]],
          ]),
          patterns: "[a-z_]+",
          charSet: ["a", "b", "c"],
        },
        {
          files: [new WebManglerFileMock("css", ".another, .one, .bites, .de_dust { }")],
          expected: [new WebManglerFileMock("css", ".c, .b, .a, .cc { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".another, .one, .bites, .de_dust { }", "[a-z_]+")
                .returns(["another", "one", "bites", "de_dust"]),
              sinon.stub()
                .withArgs(".another, .one, .bites, .de_dust { }", new Map([
                  ["another", "c"],
                  ["one", "b"],
                  ["bites", "a"],
                  ["de_dust", "cc"],
                ]))
                .returns(".c, .b, .a, .cc { }"),
            )]],
          ]),
          patterns: "[a-z_]+",
          charSet: ["c", "b", "a"],
        },
        {
          files: [new WebManglerFileMock("css", ".foo { } .bar { }")],
          expected: [new WebManglerFileMock("css", ".x { } .xx { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".foo { } .bar { }", "[a-z_]+")
                .returns(["foo", "bar"]),
              sinon.stub()
                .withArgs(".foo { } .bar { }", new Map([
                  ["foo", "x"],
                  ["bar", "xx"],
                ]))
                .returns(".x { } .xx { }"),
            )]],
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
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".foo { } .bar { }", "[a-z]+")
                .returns(["foo", "bar"]),
              sinon.stub()
                .withArgs(".foo { } .bar { }", new Map([
                  ["foo", "a"],
                  ["bar", "c"],
                ]))
                .returns(".a { } .c { }"),
            )]],
          ]),
          patterns: "[a-z]+",
          reservedNames: ["b"],
        },
        {
          files: [new WebManglerFileMock("css", ".foo { }")],
          expected: [new WebManglerFileMock("css", ".c { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".foo { }", "[a-z]+")
                .returns(["foo"]),
              sinon.stub()
                .withArgs(".foo { }", new Map([["foo", "c"]]))
                .returns(".c { }"),
            )]],
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
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".foo { } .bar { }", "[a-z]+")
                .returns(["foo", "bar"]),
              sinon.stub()
                .withArgs(".foo { } .bar { }", new Map([
                  ["foo", "cls-a"],
                  ["bar", "cls-b"],
                ]))
                .returns(".cls-a { } .cls-b { }"),
            )]],
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
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".foo { } .bar { }", "[a-z]+")
                .returns(["foo", "bar"]),
              sinon.stub()
                .withArgs(".foo { } .bar { }", new Map([
                  ["foo", "cls-b"],
                  ["bar", "cls-c"],
                ]))
                .returns(".cls-b { } .cls-c { }"),
            )]],
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
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".foo, .bar { } .bar { }", "[a-z]+")
                .returns(["foo", "bar", "bar"]),
              sinon.stub()
                .withArgs(".foo, .bar { } .bar { }", new Map([
                  ["foo", "b"],
                  ["bar", "a"],
                ]))
                .returns(".b, .a { } .a { }"),
            )]],
          ]),
          patterns: "[a-z]+",
        },
      ],
    },
    {
      name: "strings to mangle intersect with mangled string",
      cases: [
        {
          files: [new WebManglerFileMock("css", ".c, .a { }")],
          expected: [new WebManglerFileMock("css", ".a, .b { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".c, .a { }", "[a-z]+")
                .returns(["c", "a"]),
              sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            )]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".b { } .a { }")],
          expected: [new WebManglerFileMock("css", ".a { } .b { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".b { } .a { }", "[a-z]+")
                .returns(["b", "a"]),
              sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            )]],
          ]),
          patterns: "[a-z]+",
          description: "mangled source may be re-mangled",
        },
        {
          files: [new WebManglerFileMock("css", ".b, .a, .z { } .a.b { }")],
          expected: [new WebManglerFileMock("css", ".a, .b, .c { } .b.a { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".b, .a, .z { } .a.b { }", "[a-z]+")
                .returns(["b", "a", "z", "a", "b"]),
              sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            )]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".b, .z, .a { } .a.b { }")],
          expected: [new WebManglerFileMock("css", ".a, .c, .b { } .b.a { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".b, .z, .a { } .a.b { }", "[a-z]+")
                .returns(["b", "z", "a", "a", "b"]),
              sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            )]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".z, .b, .a { } .a.b { }")],
          expected: [new WebManglerFileMock("css", ".c, .a, .b { } .b.a { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".z, .b, .a { } .a.b { }", "[a-z]+")
                .returns(["z", "b", "a", "a", "b"]),
              sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            )]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".b, .a, .x, .y { }")],
          expected: [new WebManglerFileMock("css", ".a, .b, .c, .d { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".b, .a, .x, .y { }", "[a-z]+")
                .returns(["b", "a", "x", "y"]),
              sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            )]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".b, .a, .c, .d { }")],
          expected: [new WebManglerFileMock("css", ".a, .b, .c, .d { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".b, .a, .c, .d { }", "[a-z]+")
                .returns(["b", "a", "c", "d"]),
              sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            )]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".d, .c, .b, .a { }")],
          expected: [new WebManglerFileMock("css", ".a, .b, .c, .d { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".d, .c, .b, .a { }", "[a-z]+")
                .returns(["d", "c", "b", "a"]),
              sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            )]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".c, .d, .b, .a { }")],
          expected: [new WebManglerFileMock("css", ".a, .b, .c, .d { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".c, .d, .b, .a { }", "[a-z]+")
                .returns(["c", "d", "b", "a"]),
              sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            )]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new WebManglerFileMock("css", ".x, .a, .b { }")],
          expected: [new WebManglerFileMock("css", ".a, .b, .c { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".x, .a, .b { }", "[a-z]+")
                .returns(["x", "a", "b"]),
              sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            )]],
          ]),
          patterns: "[a-z]+",
        },
      ],
    },
    {
      name: "already mangled",
      cases: [
        {
          files: [new WebManglerFileMock("css", ".a { }")],
          expected: [new WebManglerFileMock("css", ".a { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".a { }", "[a-z]+")
                .returns(["a"]),
              sinon.stub()
                .callsFake((content, map) => {
                  if (map.size === 0) {
                    return content;
                  }
                }),
            )]],
          ]),
          patterns: "[a-z]+",
          description: "no changes expected if source is already mangled",
        },
        {
          files: [new WebManglerFileMock("css", ".a, .b { }")],
          expected: [new WebManglerFileMock("css", ".a, .b { }")],
          expressions: new Map([
            ["css", [new MangleExpressionMock(
              sinon.stub()
                .withArgs(".a, .b { }", "[a-z]+")
                .returns(["a", "b"]),
              sinon.stub()
                .callsFake((content, map) => {
                  if (map.size === 0) {
                    return content;
                  }
                }),
            )]],
          ]),
          patterns: "[a-z]+",
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
