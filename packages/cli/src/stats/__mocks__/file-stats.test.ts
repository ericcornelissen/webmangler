import { expect } from "chai";

import FileStatsMock from "./file-stats.mock";

suite("FileStatsMock", function() {
  suite("::changed", function() {
    test("did change", function() {
      const sizeBefore = 3;
      const sizeAfter = 2;
      expect(sizeBefore).not.to.equal(sizeAfter);

      const subject = new FileStatsMock(sizeBefore, sizeAfter);
      expect(subject.changed).to.be.true;
    });

    test("did not change", function() {
      const sizeBefore = 3;
      const sizeAfter = sizeBefore;

      const subject = new FileStatsMock(sizeBefore, sizeAfter);
      expect(subject.changed).to.be.false;
    });
  });

  suite("::changedPercentage", function() {
    test("with explicit changedSize", function() {
      const changedPercentage = 3.14;

      const subject = new FileStatsMock(2, 1, changedPercentage);
      expect(subject.changePercentage).to.equal(changedPercentage);
    });

    test("without explicit changedSize", function() {
      const subject = new FileStatsMock(2, 1);
      expect(subject.changePercentage).not.to.be.undefined;
    });
  });

  test("sizeBefore", function() {
    const sizeBefore = 3;

    const subject = new FileStatsMock(sizeBefore, 0);
    expect(subject.sizeBefore).to.equal(sizeBefore);
  });

  test("sizeAfter", function() {
    const sizeAfter = 3;

    const subject = new FileStatsMock(0, sizeAfter);
    expect(subject.sizeAfter).to.equal(sizeAfter);
  });
});
