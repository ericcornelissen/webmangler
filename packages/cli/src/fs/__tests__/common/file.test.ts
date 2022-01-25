import { expect } from "chai";

import FileMock from "./file.mock";

suite("FileMock", function() {
  test("with content", function() {
    const content = "foobar";

    const subject = new FileMock({ content });
    expect(subject.content).to.equal(content);
    expect(subject.originalSize).not.to.be.undefined;
    expect(subject.path).not.to.be.undefined;
    expect(subject.size).not.to.be.undefined;
    expect(subject.type).not.to.be.undefined;
  });

  test("with originalSize", function() {
    const originalSize = 42;

    const subject = new FileMock({ originalSize });
    expect(subject.content).not.to.be.undefined;
    expect(subject.originalSize).to.equal(originalSize);
    expect(subject.path).not.to.be.undefined;
    expect(subject.size).not.to.be.undefined;
    expect(subject.type).not.to.be.undefined;
  });

  test("with path", function() {
    const path = "foobar";

    const subject = new FileMock({ path });
    expect(subject.content).not.to.be.undefined;
    expect(subject.originalSize).not.to.be.undefined;
    expect(subject.path).to.equal(path);
    expect(subject.size).not.to.be.undefined;
    expect(subject.type).not.to.be.undefined;
  });

  test("with size", function() {
    const size = 16.7;

    const subject = new FileMock({ size });
    expect(subject.content).not.to.be.undefined;
    expect(subject.originalSize).not.to.be.undefined;
    expect(subject.path).not.to.be.undefined;
    expect(subject.size).to.equal(size);
    expect(subject.type).not.to.be.undefined;
  });

  test("with type", function() {
    const type = "foobar";

    const subject = new FileMock({ type });
    expect(subject.content).not.to.be.undefined;
    expect(subject.originalSize).not.to.be.undefined;
    expect(subject.path).not.to.be.undefined;
    expect(subject.size).not.to.be.undefined;
    expect(subject.type).to.equal(type);
  });
});
