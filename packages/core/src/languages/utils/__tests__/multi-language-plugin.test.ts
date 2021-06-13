import type {
  MangleExpression,
  WebManglerEmbed,
  WebManglerLanguagePlugin,
} from "../../../types";

import {
  MangleExpressionMock,
  WebManglerLanguagePluginMock,
} from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import MultiLanguagePlugin from "../multi-language-plugin.class";

class ConcreteMultiLanguagePlugin extends MultiLanguagePlugin {
  constructor(plugins: Iterable<WebManglerLanguagePlugin>) {
    super(plugins);
  }
}

suite("MultiLanguagePlugin", function() {
  suite("::constructor", function() {
    test("zero plugins", function() {
      expect(() => new ConcreteMultiLanguagePlugin([])).not.to.throw();
    });

    test("one plugin", function() {
      const plugin = new WebManglerLanguagePluginMock();
      expect(() => new ConcreteMultiLanguagePlugin([plugin])).not.to.throw();
    });

    test("multiple plugins", function() {
      const pluginA = new WebManglerLanguagePluginMock();
      const pluginB = new WebManglerLanguagePluginMock();
      const plugins = [pluginA, pluginB];
      expect(() => new ConcreteMultiLanguagePlugin(plugins)).not.to.throw();
    });
  });

  suite("::getEmbeds", function() {
    type TestCase = {
      readonly name: string;
      readonly embedsLists: WebManglerEmbed[][];
    }

    const testCases: TestCase[] = [
      {
        name: "no plugins",
        embedsLists: [],
      },
      {
        name: "one plugin, no embeds",
        embedsLists: [
          [],
        ],
      },
      {
        name: "one plugin, multiple embeds",
        embedsLists: [
          [
            buildWebManglerEmbed("-1"),
            buildWebManglerEmbed("12"),
          ],
        ],
      },
      {
        name: "multiple plugins, multiple embeds",
        embedsLists: [
          [
            buildWebManglerEmbed("foo"),
            buildWebManglerEmbed("bar"),
          ],
          [
            buildWebManglerEmbed("hello"),
            buildWebManglerEmbed("world"),
          ],
        ],
      },
    ];

    const file = { type: "foo", content: "bar" };

    for (const testCase of testCases) {
      const { name, embedsLists } = testCase;
      test(name, function() {
        const expected = [];
        const plugins = [];
        for (const embedsList of embedsLists) {
          const plugin = new WebManglerLanguagePluginMock({
            getEmbeds: sinon.stub().returns(embedsList),
          });

          expected.push(...embedsList);
          plugins.push(plugin);
        }

        const subject = new ConcreteMultiLanguagePlugin(plugins);
        const result = subject.getEmbeds(file);
        expect(result).to.deep.equal(expected);
      });
    }
  });

  suite("::getExpressions", function() {
    type TestCase = {
      readonly name: string;
      readonly expressionsMaps: Map<string, Iterable<MangleExpression>>[];
    }

    const testCases: TestCase[] = [
      {
        name: "no plugins",
        expressionsMaps: [],
      },
      {
        name: "one plugin, no expressions",
        expressionsMaps: [
          new Map(),
        ],
      },
      {
        name: "one plugin, with expressions",
        expressionsMaps: [
          new Map([
            ["-1", [new MangleExpressionMock()]],
            ["12", [new MangleExpressionMock()]],
          ]),
        ],
      },
      {
        name: "multiple plugins, with expressions",
        expressionsMaps: [
          new Map([
            ["Hello", [new MangleExpressionMock()]],
            ["World!", [new MangleExpressionMock()]],
          ]),
          new Map([
            ["praise", [new MangleExpressionMock()]],
            ["the", [new MangleExpressionMock()]],
            ["sun", [new MangleExpressionMock()]],
          ]),
        ],
      },
    ];

    for (const testCase of testCases) {
      const { name, expressionsMaps } = testCase;
      test(name, function() {
        const expected = new Map();
        const plugins = [];
        for (const expressionsMap of expressionsMaps) {
          const plugin = new WebManglerLanguagePluginMock({
            getExpressions: sinon.stub().returns(expressionsMap),
          });

          expressionsMap.forEach((value, key) => expected.set(key, value)),
          plugins.push(plugin);
        }

        const subject = new ConcreteMultiLanguagePlugin(plugins);
        const result = subject.getExpressions("foobar", { });
        expect(result).to.deep.equal(expected);
      });
    }
  });

  suite("::getLanguages", function() {
    type TestCase = {
      readonly name: string;
      readonly languagesLists: string[][];
    }

    const testCases: TestCase[] = [
      {
        name: "no plugins",
        languagesLists: [],
      },
      {
        name: "one plugin, no languages",
        languagesLists: [
          [],
        ],
      },
      {
        name: "one plugin, with languages",
        languagesLists: [
          ["html", "xhtml"],
        ],
      },
      {
        name: "multiple plugins, with languages",
        languagesLists: [
          ["css"],
          ["js", "cjs", "mjs"],
        ],
      },
    ];

    for (const testCase of testCases) {
      const { name, languagesLists } = testCase;
      test(name, function() {
        const expected = [];
        const plugins = [];
        for (const languagesList of languagesLists) {
          const plugin = new WebManglerLanguagePluginMock({
            getLanguages: sinon.stub().returns(languagesList),
          });

          expected.push(...languagesList);
          plugins.push(plugin);
        }

        const subject = new ConcreteMultiLanguagePlugin(plugins);
        const result = subject.getLanguages();
        expect(result).to.deep.equal(expected);
      });
    }
  });
});

/**
 * Create a {@link WebManglerEmbed} for testing purposes.
 *
 * @param id A unique identifier for the embed.
 * @returns A {@link WebManglerEmbed}.
 */
function buildWebManglerEmbed(id: string): WebManglerEmbed {
  return {
    content: id,
    type: "example",
    startIndex: 3,
    endIndex: 14,
    getRaw(): string {
      return "foobar";
    },
  };
}
