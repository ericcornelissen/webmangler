import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import WriterMock from "./writer.mock";

chaiUse(sinonChai);

suite("WriterMock", function() {
  test("no argument", function() {
    const subject = new WriterMock();
    expect(subject.write).not.to.be.undefined;
    expect(() => subject.write()).not.to.throw();
  });

  test("no stubs", function() {
    const subject = new WriterMock({ });
    expect(subject.write).not.to.be.undefined;
    expect(() => subject.write()).not.to.throw();
  });

  test("only a write stub", function() {
    const write = sinon.stub();

    const subject = new WriterMock({ write });
    expect(subject.write).not.to.be.undefined;
    expect(() => subject.write()).not.to.throw();
    expect(write).to.have.been.calledOnce;
  });
});
