import type { TestScenario } from "@webmangler/testing";
import type {
  CharSet,
  MangleExpression,
  WebManglerFile,
} from "@webmangler/types";

import { MangleExpressionMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import engine from "../../index";

interface TestCase {
  description?: string;
  expected: WebManglerFile[];
  expressions: Map<string, MangleExpression[]>;
  files: WebManglerFile[];
  patterns: string | string[];
  charSet?: CharSet;
  ignorePatterns?: string | string[];
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
          files: [{
            type: "css",
            content: ".foo { } #bar { }",
          }],
          expected: [{
            type: "css",
            content: ".a { } #bar { }",
          }],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".foo { } #bar { }", "[a-z]+")
                .returns(["foo"]),
              replaceAll: sinon.stub()
                .withArgs(".foo { } #bar { }", new Map([["foo", "a"]]))
                .returns(".a { } #bar { }"),
            })]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [{
            type: "css",
            content: ".foo { } .cls-bar { }",
          }],
          expected: [{
            type: "css",
            content: ".foo { } .a { }",
          }],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".foo { } .cls-bar { }", "cls-[a-z]+")
                .returns(["cls-bar"]),
              replaceAll: sinon.stub()
                .withArgs(".foo { } .cls-bar { }", new Map([["cls-bar", "a"]]))
                .returns(".foo { } .a { }"),
            })]],
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
            {
              type: "css",
              content: ".foo { }",
            },
            {
              type: "css",
              content: "#bar { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a { }",
            },
            {
              type: "css",
              content: "#bar { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .callsFake((content) => {
                  if (content === ".foo { }") {
                    return ["foo"];
                  }

                  return [];
                }),
              replaceAll: sinon.stub()
                .callsFake((content) => {
                  if (content === ".foo { }") {
                    return ".a { }";
                  } else if (content === "#bar { }") {
                    return "#bar { }";
                  }

                  return content;
                }),
            })]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            {
              type: "css",
              content: ".foo { }",
            },
            {
              type: "css",
              content: ".bar { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a { }",
            },
            {
              type: "css",
              content: ".b { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .callsFake((content) => {
                  if (content === ".foo { }") {
                    return ["foo"];
                  } else if (content === ".bar { }") {
                    return ["bar"];
                  }
                }),
              replaceAll: sinon.stub()
                .callsFake((content) => {
                  if (content === ".foo { }") {
                    return ".a { }";
                  } else if (content === ".bar { }") {
                    return ".b { }";
                  }

                  return content;
                }),
            })]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            {
              type: "css",
              content: ".foo { }",
            },
            {
              type: "css",
              content: ".foo { } .bar { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a { }",
            },
            {
              type: "css",
              content: ".a { } .b { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .callsFake((content) => {
                  if (content === ".foo { }") {
                    return ["foo"];
                  } else if (content === ".foo { } .bar { }") {
                    return ["foo", "bar"];
                  }
                }),
              replaceAll: sinon.stub()
                .callsFake((content) => {
                  if (content === ".foo { }") {
                    return ".a { }";
                  } else if (content === ".foo { } .bar { }") {
                    return ".a { } .b { }";
                  }

                  return content;
                }),
            })]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            {
              type: "css",
              content: ".foo { }",
            },
            {
              type: "html",
              content: "<div class=\"cls-foo cls-bar\">",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a { }",
            },
            {
              type: "html",
              content: "<div class=\"b c\">",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".foo { }", "[a-z]+")
                .returns(["foo"]),
              replaceAll: sinon.stub()
                .withArgs(".foo { }", sinon.match.map)
                .returns(".a { }"),
            })]],
            ["html", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs("<div class=\"cls-foo cls-bar\">", "[a-z]+")
                .returns(["cls-foo", "cls-bar"]),
              replaceAll: sinon.stub()
                .withArgs("<div class=\"cls-foo cls-bar\">", sinon.match.map)
                .returns("<div class=\"b c\">"),
            })]],
          ]),
          patterns: "[a-z]+",
        },
      ],
    },
    {
      name: "custom character set",
      cases: [
        {
          files: [
            {
              type: "css",
              content: ".another, .one, .bites, .de_dust { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a, .b, .c, .aa { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".another, .one, .bites, .de_dust { }", "[a-z_]+")
                .returns(["another", "one", "bites", "de_dust"]),
              replaceAll: sinon.stub()
                .withArgs(".another, .one, .bites, .de_dust { }", new Map([
                  ["another", "a"],
                  ["one", "b"],
                  ["bites", "c"],
                  ["de_dust", "aa"],
                ]))
                .returns(".a, .b, .c, .aa { }"),
            })]],
          ]),
          patterns: "[a-z_]+",
          charSet: ["a", "b", "c"],
        },
        {
          files: [
            {
              type: "css",
              content: ".another, .one, .bites, .de_dust { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".c, .b, .a, .cc { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".another, .one, .bites, .de_dust { }", "[a-z_]+")
                .returns(["another", "one", "bites", "de_dust"]),
              replaceAll: sinon.stub()
                .withArgs(".another, .one, .bites, .de_dust { }", new Map([
                  ["another", "c"],
                  ["one", "b"],
                  ["bites", "a"],
                  ["de_dust", "cc"],
                ]))
                .returns(".c, .b, .a, .cc { }"),
            })]],
          ]),
          patterns: "[a-z_]+",
          charSet: ["c", "b", "a"],
        },
        {
          files: [
            {
              type: "css",
              content: ".foo { } .bar { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".x { } .xx { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".foo { } .bar { }", "[a-z_]+")
                .returns(["foo", "bar"]),
              replaceAll: sinon.stub()
                .withArgs(".foo { } .bar { }", new Map([
                  ["foo", "x"],
                  ["bar", "xx"],
                ]))
                .returns(".x { } .xx { }"),
            })]],
          ]),
          patterns: "[a-z]+",
          charSet: ["x"],
        },
      ],
    },
    {
      name: "ignore patterns",
      cases: [
        {
          files: [
            {
              type: "css",
              content: ".foo { } .bar { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".foo { } .a { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".foo { } .bar { }", "[a-z]+")
                .returns(["foo", "bar"]),
              replaceAll: sinon.stub()
                .withArgs(".foo { } .bar { }", new Map([
                  ["bar", "a"],
                ]))
                .returns(".foo { } .a { }"),
            })]],
          ]),
          patterns: "[a-z]+",
          ignorePatterns: "f[a-z]+",
        },
        {
          files: [
            {
              type: "css",
              content: ".foo { } .bar { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a { } .bar { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".foo { } .bar { }", "[a-z]+")
                .returns(["foo", "bar"]),
              replaceAll: sinon.stub()
                .withArgs(".foo { } .bar { }", new Map([
                  ["foo", "a"],
                ]))
                .returns(".a { } .bar { }"),
            })]],
          ]),
          patterns: "[a-z]+",
          ignorePatterns: ["b[a-z]+"],
        },
      ],
    },
    {
      name: "reserved names",
      cases: [
        {
          files: [
            {
              type: "css",
              content: ".foo { } .bar { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a { } .c { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".foo { } .bar { }", "[a-z]+")
                .returns(["foo", "bar"]),
              replaceAll: sinon.stub()
                .withArgs(".foo { } .bar { }", new Map([
                  ["foo", "a"],
                  ["bar", "c"],
                ]))
                .returns(".a { } .c { }"),
            })]],
          ]),
          patterns: "[a-z]+",
          reservedNames: ["b"],
        },
        {
          files: [
            {
              type: "css",
              content: ".foo { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".c { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".foo { }", "[a-z]+")
                .returns(["foo"]),
              replaceAll: sinon.stub()
                .withArgs(".foo { }", new Map([["foo", "c"]]))
                .returns(".c { }"),
            })]],
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
          files: [
            {
              type: "css",
              content: ".foo { } .bar { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".cls-a { } .cls-b { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".foo { } .bar { }", "[a-z]+")
                .returns(["foo", "bar"]),
              replaceAll: sinon.stub()
                .withArgs(".foo { } .bar { }", new Map([
                  ["foo", "cls-a"],
                  ["bar", "cls-b"],
                ]))
                .returns(".cls-a { } .cls-b { }"),
            })]],
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
          files: [
            {
              type: "css",
              content: ".foo { } .bar { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".cls-b { } .cls-c { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".foo { } .bar { }", "[a-z]+")
                .returns(["foo", "bar"]),
              replaceAll: sinon.stub()
                .withArgs(".foo { } .bar { }", new Map([
                  ["foo", "cls-b"],
                  ["bar", "cls-c"],
                ]))
                .returns(".cls-b { } .cls-c { }"),
            })]],
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
          files: [
            {
              type: "css",
              content: ".foo { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".foo { }",
            },
          ],
          expressions: new Map(),
          patterns: "",
        },
        {
          files: [
            {
              type: "css",
              content: ".foo { }",
            },
            {
              type: "html",
              content: "<p>Hello world!</p>",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a { }",
            },
            {
              type: "html",
              content: "<p>Hello world!</p>",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".foo { }", "[a-z]+")
                .returns(["foo"]),
              replaceAll: sinon.stub()
                .withArgs(".foo { }", new Map([
                  ["foo", "a"],
                ]))
                .returns(".a { }"),
            })]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            {
              type: "css",
              content: ".foo { }",
            },
            {
              type: "html",
              content: "<p>Hello world!</p>",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".foo { }",
            },
            {
              type: "html",
              content: "<p>Hello world!</p>",
            },
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
          files: [
            {
              type: "css",
              content: ".foo, .bar { } .bar { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".b, .a { } .a { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".foo, .bar { } .bar { }", "[a-z]+")
                .returns(["foo", "bar", "bar"]),
              replaceAll: sinon.stub()
                .withArgs(".foo, .bar { } .bar { }", new Map([
                  ["foo", "b"],
                  ["bar", "a"],
                ]))
                .returns(".b, .a { } .a { }"),
            })]],
          ]),
          patterns: "[a-z]+",
        },
      ],
    },
    {
      name: "strings to mangle intersect with mangled string",
      cases: [
        {
          files: [
            {
              type: "css",
              content: ".c, .a { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a, .b { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".c, .a { }", "[a-z]+")
                .returns(["c", "a"]),
              replaceAll: sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            })]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            {
              type: "css",
              content: ".b { } .a { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a { } .b { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".b { } .a { }", "[a-z]+")
                .returns(["b", "a"]),
              replaceAll: sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            })]],
          ]),
          patterns: "[a-z]+",
          description: "mangled source may be re-mangled",
        },
        {
          files: [
            {
              type: "css",
              content: ".b, .a, .z { } .a.b { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a, .b, .c { } .b.a { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".b, .a, .z { } .a.b { }", "[a-z]+")
                .returns(["b", "a", "z", "a", "b"]),
              replaceAll: sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            })]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            {
              type: "css",
              content: ".b, .z, .a { } .a.b { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a, .c, .b { } .b.a { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".b, .z, .a { } .a.b { }", "[a-z]+")
                .returns(["b", "z", "a", "a", "b"]),
              replaceAll: sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            })]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            {
              type: "css",
              content: ".z, .b, .a { } .a.b { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".c, .a, .b { } .b.a { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".z, .b, .a { } .a.b { }", "[a-z]+")
                .returns(["z", "b", "a", "a", "b"]),
              replaceAll: sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            })]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            {
              type: "css",
              content: ".b, .a, .x, .y { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a, .b, .c, .d { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".b, .a, .x, .y { }", "[a-z]+")
                .returns(["b", "a", "x", "y"]),
              replaceAll: sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            })]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            {
              type: "css",
              content: ".b, .a, .c, .d { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a, .b, .c, .d { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".b, .a, .c, .d { }", "[a-z]+")
                .returns(["b", "a", "c", "d"]),
              replaceAll: sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            })]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            {
              type: "css",
              content: ".d, .c, .b, .a { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a, .b, .c, .d { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".d, .c, .b, .a { }", "[a-z]+")
                .returns(["d", "c", "b", "a"]),
              replaceAll: sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            })]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            {
              type: "css",
              content: ".c, .d, .b, .a { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a, .b, .c, .d { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".c, .d, .b, .a { }", "[a-z]+")
                .returns(["c", "d", "b", "a"]),
              replaceAll: sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            })]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            {
              type: "css",
              content: ".x, .a, .b { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a, .b, .c { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".x, .a, .b { }", "[a-z]+")
                .returns(["x", "a", "b"]),
              replaceAll: sinon.stub()
                .callsFake((content, map) => {
                  map.forEach((value: string, key: string) => {
                    const expr = new RegExp(key, "g");
                    content = content.replace(expr, value);
                  });

                  return content;
                }),
            })]],
          ]),
          patterns: "[a-z]+",
        },
      ],
    },
    {
      name: "already mangled",
      cases: [
        {
          files: [
            {
              type: "css",
              content: ".a { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".a { }", "[a-z]+")
                .returns(["a"]),
              replaceAll: sinon.stub()
                .callsFake((content, map) => {
                  if (map.size === 0) {
                    return content;
                  }
                }),
            })]],
          ]),
          patterns: "[a-z]+",
          description: "no changes expected if source is already mangled",
        },
        {
          files: [
            {
              type: "css",
              content: ".a, .b { }",
            },
          ],
          expected: [
            {
              type: "css",
              content: ".a, .b { }",
            },
          ],
          expressions: new Map([
            ["css", [new MangleExpressionMock({
              findAll: sinon.stub()
                .withArgs(".a, .b { }", "[a-z]+")
                .returns(["a", "b"]),
              replaceAll: sinon.stub()
                .callsFake((content, map) => {
                  if (map.size === 0) {
                    return content;
                  }
                }),
            })]],
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
          ignorePatterns: testCase.ignorePatterns,
          patterns: testCase.patterns,
          reservedNames: testCase.reservedNames,
          manglePrefix: testCase.manglePrefix,
        });
        expect(result).to.deep.equal(expected, failureMessage);
      }
    });
  }
});
