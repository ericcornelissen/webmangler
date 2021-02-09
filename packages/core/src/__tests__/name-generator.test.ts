import { expect } from "chai";

import NameGenerator from "../name-generator.class";

const charsetSize = NameGenerator.CHARSET.length;

const a = NameGenerator.CHARSET[0];
const b = NameGenerator.CHARSET[1];
const c = NameGenerator.CHARSET[2];
const d = NameGenerator.CHARSET[3];
const e = NameGenerator.CHARSET[4];
const z = NameGenerator.CHARSET[charsetSize - 1];

suite("NameGenerator", function() {
  suite("No reserved", function() {
    test("one-character names", function() {
      const g = new NameGenerator();
      for (const char of NameGenerator.CHARSET) {
        expect(g.nextName()).to.equal(char);
      }
    });

    test("two-character names", function() {
      const g = new NameGenerator();
      for (let i = 0; i < charsetSize - 1; i++) {
        g.nextName();
      }

      expect(g.nextName()).to.equal(z);
      expect(g.nextName()).to.equal(`${a}${a}`);
      expect(g.nextName()).to.equal(`${a}${b}`);

      for (let i = 0; i < charsetSize - 3; i++) {
        g.nextName();
      }

      expect(g.nextName()).to.equal(`${a}${z}`);
      expect(g.nextName()).to.equal(`${b}${a}`);
      expect(g.nextName()).to.equal(`${b}${b}`);
    });

    test("three-character names", function() {
      const g = new NameGenerator();
      for (let i = 0; i < (charsetSize + 1) * charsetSize; i++) {
        g.nextName();
      }

      expect(g.nextName()).to.equal(`${a}${a}${a}`);
      expect(g.nextName()).to.equal(`${a}${a}${b}`);

      for (let i = 0; i < charsetSize - 3; i++) {
        g.nextName();
      }

      expect(g.nextName()).to.equal(`${a}${a}${z}`);
      expect(g.nextName()).to.equal(`${a}${b}${a}`);
      expect(g.nextName()).to.equal(`${a}${b}${b}`);

      for (let i = 0; i < charsetSize - 3; i++) {
        g.nextName();
      }

      expect(g.nextName()).to.equal(`${a}${b}${z}`);
      expect(g.nextName()).to.equal(`${a}${c}${a}`);
      expect(g.nextName()).to.equal(`${a}${c}${b}`);

      for (let i = 0; i < ((charsetSize - 2) * charsetSize) - 3; i++) {
        g.nextName();
      }

      expect(g.nextName()).to.equal(`${a}${z}${z}`);
      expect(g.nextName()).to.equal(`${b}${a}${a}`);
      expect(g.nextName()).to.equal(`${b}${a}${b}`);
    });
  });

  suite("With reserved", function() {
    test("one-character names", function() {
      const g1 = new NameGenerator([a]);
      expect(g1.nextName()).to.equal(b);
      expect(g1.nextName()).to.equal(c);
      for (let i = 0; i < charsetSize - 3; i++) {
        g1.nextName();
      }
      expect(g1.nextName()).to.equal(`${a}${a}`);

      const g2 = new NameGenerator([b]);
      expect(g2.nextName()).to.equal(a);
      expect(g2.nextName()).to.equal(c);
      expect(g2.nextName()).to.equal(d);
      for (let i = 0; i < (charsetSize * 2) - 4; i++) {
        g2.nextName();
      }
      expect(g2.nextName()).to.equal(`${b}${a}`);

      const g3 = new NameGenerator([b, c]);
      expect(g3.nextName()).to.equal(a);
      expect(g3.nextName()).to.equal(d);
      expect(g3.nextName()).to.equal(e);
      for (let i = 0; i < (charsetSize * 2) - 5; i++) {
        g3.nextName();
      }
      expect(g3.nextName()).to.equal(`${b}${a}`);
      for (let i = 0; i < charsetSize - 1; i++) {
        g3.nextName();
      }
      expect(g3.nextName()).to.equal(`${c}${a}`);

      const g4 = new NameGenerator([b, d]);
      expect(g4.nextName()).to.equal(a);
      expect(g4.nextName()).to.equal(c);
      expect(g4.nextName()).to.equal(e);
      for (let i = 0; i < (charsetSize * 2) - 5; i++) {
        g4.nextName();
      }
      expect(g4.nextName()).to.equal(`${b}${a}`);
      for (let i = 0; i < (charsetSize * 2) - 1; i++) {
        g4.nextName();
      }
      expect(g4.nextName()).to.equal(`${d}${a}`);
    });

    test("two-character names", function() {
      const g = new NameGenerator([`${a}${a}`, `${b}${b}`]);
      expect(g.nextName()).to.equal(a);
      expect(g.nextName()).to.equal(b);

      for (let i = 0; i < charsetSize - 2; i++) {
        g.nextName();
      }

      expect(g.nextName()).to.equal(`${a}${b}`);

      for (let i = 0; i < (charsetSize - 1); i++) {
        g.nextName();
      }

      expect(g.nextName()).to.equal(`${b}${c}`);
    });

    test("reserved expression", function() {
      const g = new NameGenerator([`${a}.*`]);
      expect(g.nextName()).to.equal(b);

      for (let i = 0; i < charsetSize - 2; i++) {
        g.nextName();
      }

      expect(g.nextName()).to.equal(`${b}${a}`);
    });

    test("mixed reserved", function() {
      const g = new NameGenerator(["c", `${a}.*`]);
      expect(g.nextName()).to.equal(b);
      expect(g.nextName()).to.equal(d);

      for (let i = 0; i < charsetSize - 4; i++) {
        g.nextName();
      }

      expect(g.nextName()).to.equal(`${b}${a}`);
    });
  });
});
