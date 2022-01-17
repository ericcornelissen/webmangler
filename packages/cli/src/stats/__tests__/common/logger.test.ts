import { expect, use as chaiUse } from "chai";
import * as sinonChai from "sinon-chai";

import LoggerMock from "./logger.mock";

chaiUse(sinonChai);

suite("LoggerMock", function() {
  suite("::resetHistory", function() {
    test("debug", function() {
      const subject = new LoggerMock();
      subject.debug("foobar");

      subject.resetHistory();
      expect(subject.debug).not.to.have.been.called;
    });

    test("info", function() {
      const subject = new LoggerMock();
      subject.info("foobar");

      subject.resetHistory();
      expect(subject.info).not.to.have.been.called;
    });

    test("print", function() {
      const subject = new LoggerMock();
      subject.print("foobar");

      subject.resetHistory();
      expect(subject.print).not.to.have.been.called;
    });

    test("warn", function() {
      const subject = new LoggerMock();
      subject.warn("foobar");

      subject.resetHistory();
      expect(subject.warn).not.to.have.been.called;
    });
  });
});
