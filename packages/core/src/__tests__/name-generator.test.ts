import type { CharSet } from "../types";

import { expect } from "chai";

import {
  ALL_LOWERCASE_CHARS,
  ALL_NUMBER_CHARS,
  ALL_UPPERCASE_CHARS,
} from "../characters";
import NameGenerator from "../name-generator.class";

suite("NameGenerator", function() {
  const noReservedScenarios: {
    name: string,
    cases: (CharSet | undefined)[],
  }[] = [
    {
      name: "default character set",
      cases: [
        undefined, // Defaults to the default character set
      ],
    },
    {
      name: "custom character sets",
      cases: [
        ALL_LOWERCASE_CHARS,
        ALL_NUMBER_CHARS,
        ALL_UPPERCASE_CHARS,
        [...ALL_LOWERCASE_CHARS, ...ALL_UPPERCASE_CHARS],
        [...ALL_LOWERCASE_CHARS, ...ALL_NUMBER_CHARS],
        ["a", "b", "c", "d"],
        ["-", "_", "x", "y"],
      ],
    },
  ];

  for (const { name, cases } of noReservedScenarios) {
    test(`${name}, without reserved`, function() {
      for (const testCase of cases) {
        const charSet = testCase || NameGenerator.DEFAULT_CHARSET;
        expect(charSet).to.have.length.above(3);

        const charSetSize = charSet.length;
        const firstChar = charSet[0];
        const secondChar = charSet[1];
        const lastChar = charSet[charSetSize - 1];

        const g = new NameGenerator(undefined, testCase);
        for (const char of charSet) {
          expect(g.nextName()).to.equal(char);
        }

        expect(g.nextName()).to.equal(`${firstChar}${firstChar}`);
        expect(g.nextName()).to.equal(`${firstChar}${secondChar}`);

        for (let i = 0; i < charSetSize - 3; i++) {
          g.nextName();
        }

        expect(g.nextName()).to.equal(`${firstChar}${lastChar}`);
        expect(g.nextName()).to.equal(`${secondChar}${firstChar}`);

        for (let i = 0; i < ((charSetSize - 2) * charSetSize) - 1; i++) {
          g.nextName();
        }

        expect(g.nextName()).to.equal(`${lastChar}${firstChar}`);
        expect(g.nextName()).to.equal(`${lastChar}${secondChar}`);

        for (let i = 0; i < charSetSize - 3; i++) {
          g.nextName();
        }

        expect(g.nextName()).to.equal(`${lastChar}${lastChar}`);
        expect(g.nextName()).to.equal(`${firstChar}${firstChar}${firstChar}`);
        expect(g.nextName()).to.equal(`${firstChar}${firstChar}${secondChar}`);
      }
    });
  }

  const reservedScenarios: {
    name: string,
    cases: {
      charSet?: CharSet,
      reserved: string[],
      _points_: { inc: number, name: string }[],
    }[],
  }[] = [
    {
      name: "reserved strings",
      cases: [
        {
          reserved: ["a"],
          _points_: [
            { inc: 0, name: "b" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 2, name: "aa" },
          ],
        },
        {
          reserved: ["a", "b", "ab"],
          _points_: [
            { inc: 0, name: "c" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 3, name: "aa" },
            { inc: 0, name: "ac" },
          ],
        },
        {
          charSet: ALL_LOWERCASE_CHARS,
          reserved: ["a"],
          _points_: [
            { inc: 0, name: "b" },
            { inc: ALL_LOWERCASE_CHARS.length - 2, name: "aa" },
          ],
        },
        {
          charSet: ALL_UPPERCASE_CHARS,
          reserved: ["B"],
          _points_: [
            { inc: 1, name: "C" },
            { inc: ALL_UPPERCASE_CHARS.length - 2, name: "AB" },
          ],
        },
        {
          charSet: ALL_NUMBER_CHARS,
          reserved: ["3", "1", "4"],
          _points_: [
            { inc: 2, name: "5" },
            { inc: ALL_NUMBER_CHARS.length - 5, name: "01" },
          ],
        },
      ],
    },
    {
      name: "reserved patterns",
      cases: [
        {
          reserved: ["a.*"],
          _points_: [
            { inc: 0, name: "b" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 2, name: "ba" },
          ],
        },
        {
          reserved: [".*b"],
          _points_: [
            { inc: 0, name: "a" },
            { inc: 0, name: "c" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 3, name: "aa" },
            { inc: 0, name: "ac" },
          ],
        },
        {
          reserved: ["a.", ".c"],
          _points_: [
            { inc: 0, name: "a" },
            { inc: 0, name: "b" },
            { inc: 0, name: "c" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 3, name: "ba" },
            { inc: 1, name: "bd" },
          ],
        },
        {
          charSet: ALL_NUMBER_CHARS,
          reserved: ["0.*"],
          _points_: [
            { inc: 0, name: "1" },
            { inc: ALL_NUMBER_CHARS.length - 2, name: "10" },
          ],
        },
        {
          charSet: ALL_UPPERCASE_CHARS,
          reserved: [".*B.*"],
          _points_: [
            { inc: 1, name: "C" },
            { inc: ALL_UPPERCASE_CHARS.length - 2, name: "AC" },
            { inc: ALL_UPPERCASE_CHARS.length - 3, name: "CA" },
          ],
        },
        {
          charSet: [...ALL_LOWERCASE_CHARS, ...ALL_UPPERCASE_CHARS],
          reserved: ["[b-d]", "[D-G]"],
          _points_: [
            { inc: 1, name: "e" },
            { inc: ALL_LOWERCASE_CHARS.length - 3, name: "C" },
            { inc: 0, name: "H" },
          ],
        },
      ],
    },
    {
      name: "reserved strings & patterns",
      cases: [
        {
          reserved: ["a.*", "c"],
          _points_: [
            { inc: 0, name: "b" },
            { inc: 0, name: "d" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 4, name: "ba" },
            { inc: 1, name: "bc" },
          ],
        },
        {
          reserved: ["c", ".+b"],
          _points_: [
            { inc: 0, name: "a" },
            { inc: 0, name: "b" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 3, name: "aa" },
            { inc: 0, name: "ac" },
            { inc: NameGenerator.DEFAULT_CHARSET.length - 2, name: "bc" },
          ],
        },
        {
          charSet: ALL_NUMBER_CHARS,
          reserved: ["0.*", "2"],
          _points_: [
            { inc: 0, name: "1" },
            { inc: 0, name: "3" },
            { inc: ALL_NUMBER_CHARS.length - 4, name: "10" },
          ],
        },
        {
          charSet: ALL_UPPERCASE_CHARS,
          reserved: ["E", ".*B.*"],
          _points_: [
            { inc: 1, name: "C" },
            { inc: 1, name: "F" },
            { inc: ALL_UPPERCASE_CHARS.length - 5, name: "AC" },
            { inc: ALL_UPPERCASE_CHARS.length - 3, name: "CA" },
          ],
        },
      ],
    },
  ];

  for (const { name, cases } of reservedScenarios) {
    test(name, function() {
      for (const testCase of cases) {
        const { charSet: _charSet, reserved, _points_ } = testCase;

        const charSet = _charSet || NameGenerator.DEFAULT_CHARSET;
        expect(charSet).to.have.length.above(3);

        const g = new NameGenerator(reserved, _charSet);
        for (const { inc, name } of _points_) {
          for (let i = 0; i < inc; i++) {
            g.nextName();
          }

          expect(g.nextName()).to.equal(name);
        }
      }
    });
  }
});
