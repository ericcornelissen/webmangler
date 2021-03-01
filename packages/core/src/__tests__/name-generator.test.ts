import type { TestScenario } from "@webmangler/testing";
import type { CharSet } from "../characters";

import { expect } from "chai";

import {
  ALL_LOWERCASE_CHARS,
  ALL_NUMBER_CHARS,
  ALL_UPPERCASE_CHARS,
} from "../characters";
import NameGenerator from "../name-generator.class";

interface TestCase {
  charSet?: CharSet;
  reserved?: string[];
  samples: {
    inc: number,
    expected: string
  }[];
}

suite("NameGenerator", function() {
  const reservedScenarios: TestScenario<TestCase>[] = [
    {
      name: "no reserved",
      cases: [
        {
          samples: [
            ...NameGenerator.DEFAULT_CHARSET.map((char) => {
              return { inc: 0, expected: char };
            }),
            { inc: 0, expected: "aa" },
            { inc: 0, expected: "ab" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 3, expected: "az" },
            { inc: 0, expected: "ba" },
          ],
        },
        {
          samples: [
            { inc: NameGenerator.DEFAULT_CHARSET.length**2, expected: "za" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 2, expected: "zz" },
            { inc: 0, expected: "aaa" },
            { inc: 0, expected: "aab" },
          ],
        },
        {
          charSet: [...ALL_LOWERCASE_CHARS, ...ALL_UPPERCASE_CHARS],
          samples: [
            ...ALL_LOWERCASE_CHARS.map((char) => {
              return { inc: 0, expected: char };
            }),
            ...ALL_UPPERCASE_CHARS.map((char) => {
              return { inc: 0, expected: char };
            }),
            { inc: 0, expected: "aa" },
            { inc: ALL_LOWERCASE_CHARS.length - 1, expected: "aA" },
            { inc: 0, expected: "aB" },
            { inc: ALL_UPPERCASE_CHARS.length - 2, expected: "ba" },
            { inc: ALL_LOWERCASE_CHARS.length - 1, expected: "bA" },
          ],
        },
        {
          charSet: [...ALL_LOWERCASE_CHARS, ...ALL_NUMBER_CHARS],
          samples: [
            ...ALL_LOWERCASE_CHARS.map((char) => {
              return { inc: 0, expected: char };
            }),
            ...ALL_NUMBER_CHARS.map((char) => {
              return { inc: 0, expected: char };
            }),
            { inc: 0, expected: "aa" },
            { inc: ALL_LOWERCASE_CHARS.length - 1, expected: "a0" },
            { inc: 1, expected: "a2" },
            { inc: ALL_NUMBER_CHARS.length - 3, expected: "ba" },
            { inc: ALL_LOWERCASE_CHARS.length - 1, expected: "b0" },
          ],
        },
      ],
    },
    {
      name: "reserved strings",
      cases: [
        {
          reserved: ["a"],
          samples: [
            { inc: 0, expected: "b" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 2, expected: "aa" },
          ],
        },
        {
          reserved: ["a", "b", "ab"],
          samples: [
            { inc: 0, expected: "c" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 3, expected: "aa" },
            { inc: 0, expected: "ac" },
          ],
        },
        {
          charSet: ALL_LOWERCASE_CHARS,
          reserved: ["a"],
          samples: [
            { inc: 0, expected: "b" },
            { inc: ALL_LOWERCASE_CHARS.length - 2, expected: "aa" },
          ],
        },
        {
          charSet: ALL_UPPERCASE_CHARS,
          reserved: ["B"],
          samples: [
            { inc: 1, expected: "C" },
            { inc: ALL_UPPERCASE_CHARS.length - 2, expected: "AB" },
          ],
        },
        {
          charSet: ALL_NUMBER_CHARS,
          reserved: ["3", "1", "4"],
          samples: [
            { inc: 2, expected: "5" },
            { inc: ALL_NUMBER_CHARS.length - 5, expected: "01" },
          ],
        },
      ],
    },
    {
      name: "reserved patterns",
      cases: [
        {
          reserved: ["a.*"],
          samples: [
            { inc: 0, expected: "b" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 2, expected: "ba" },
          ],
        },
        {
          reserved: [".*b"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 0, expected: "c" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 3, expected: "aa" },
            { inc: 0, expected: "ac" },
          ],
        },
        {
          reserved: ["a.", ".c"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 0, expected: "b" },
            { inc: 0, expected: "c" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 3, expected: "ba" },
            { inc: 1, expected: "bd" },
          ],
        },
        {
          charSet: ALL_NUMBER_CHARS,
          reserved: ["0.*"],
          samples: [
            { inc: 0, expected: "1" },
            { inc: ALL_NUMBER_CHARS.length - 2, expected: "10" },
          ],
        },
        {
          charSet: ALL_UPPERCASE_CHARS,
          reserved: [".*B.*"],
          samples: [
            { inc: 1, expected: "C" },
            { inc: ALL_UPPERCASE_CHARS.length - 2, expected: "AC" },
            { inc: ALL_UPPERCASE_CHARS.length - 3, expected: "CA" },
          ],
        },
        {
          charSet: [...ALL_LOWERCASE_CHARS, ...ALL_UPPERCASE_CHARS],
          reserved: ["[b-d]", "[D-G]"],
          samples: [
            { inc: 1, expected: "e" },
            { inc: ALL_LOWERCASE_CHARS.length - 3, expected: "C" },
            { inc: 0, expected: "H" },
          ],
        },
      ],
    },
    {
      name: "reserved strings & patterns",
      cases: [
        {
          reserved: ["a.*", "c"],
          samples: [
            { inc: 0, expected: "b" },
            { inc: 0, expected: "d" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 4, expected: "ba" },
            { inc: 1, expected: "bc" },
          ],
        },
        {
          reserved: ["c", ".+b"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 0, expected: "b" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 3, expected: "aa" },
            { inc: 0, expected: "ac" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 2, expected: "bc" },
          ],
        },
        {
          charSet: ALL_NUMBER_CHARS,
          reserved: ["0.*", "2"],
          samples: [
            { inc: 0, expected: "1" },
            { inc: 0, expected: "3" },
            { inc: ALL_NUMBER_CHARS.length - 4, expected: "10" },
          ],
        },
        {
          charSet: ALL_UPPERCASE_CHARS,
          reserved: ["E", ".*B.*"],
          samples: [
            { inc: 1, expected: "C" },
            { inc: 1, expected: "F" },
            { inc: ALL_UPPERCASE_CHARS.length - 5, expected: "AC" },
            { inc: ALL_UPPERCASE_CHARS.length - 3, expected: "CA" },
          ],
        },
      ],
    },
  ];

  for (const { name, cases } of reservedScenarios) {
    test(name, function() {
      for (const testCase of cases) {
        const { charSet: _charSet, reserved, samples } = testCase;
        const charSet = _charSet || NameGenerator.DEFAULT_CHARSET;
        expect(charSet).to.have.length.above(3);

        const g = new NameGenerator(reserved, _charSet);
        for (const { inc, expected } of samples) {
          for (let i = 0; i < inc; i++) {
            g.nextName();
          }

          expect(g.nextName()).to.equal(expected);
        }
      }
    });
  }

  test("empty character set", function() {
    expect(() => new NameGenerator([], [])).to.throw("character set cannot be empty");
  });
});
