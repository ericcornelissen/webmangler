import { expect } from "chai";
import * as sinon from "sinon";

import DefaultLogger from "../index";

import MockWriter from "../__mocks__/writer.mock";

suite("DefaultLogger", function() {
  setup(function() {
    MockWriter.resetHistory();
  });

  test("level -1 (silent)", function() {
    const logger = new DefaultLogger(-1, MockWriter);

    const debugMessage = "Why";
    const infoMessage = "not";
    const printMessage = "Zoidberg";
    const warnMessage = "?";

    logger.debug(debugMessage);
    logger.info(infoMessage);
    logger.print(printMessage);
    logger.warn(warnMessage);

    expect(MockWriter).not.to.have.been.called;
  });

  test("level 0 (warn)", function() {
    const logger = new DefaultLogger(0, MockWriter);

    const debugMessage = "Praise";
    const infoMessage = "the";
    const printMessage = "sun";
    const warnMessage = "!";

    logger.debug(debugMessage);
    logger.info(infoMessage);
    logger.print(printMessage);
    logger.warn(warnMessage);

    expect(MockWriter).not.to.have.been.calledWith(sinon.match(debugMessage));
    expect(MockWriter).not.to.have.been.calledWith(sinon.match(infoMessage));
    expect(MockWriter).to.have.been.calledWith(sinon.match(printMessage));
    expect(MockWriter).to.have.been.calledWith(sinon.match(warnMessage));
  });

  test("level 1 (info)", function() {
    const logger = new DefaultLogger(1, MockWriter);

    const debugMessage = "Lorem";
    const infoMessage = "ipsum";
    const printMessage = "dolor";
    const warnMessage = "sit";

    logger.debug(debugMessage);
    logger.info(infoMessage);
    logger.print(printMessage);
    logger.warn(warnMessage);

    expect(MockWriter).not.to.have.been.calledWith(sinon.match(debugMessage));
    expect(MockWriter).to.have.been.calledWith(sinon.match(warnMessage));
  });

  test("level 2 (debug)", function() {
    const logger = new DefaultLogger(2, MockWriter);

    const debugMessage = "R2-D2";
    const infoMessage = "C-3PO";
    const printMessage = "BD-1";
    const warnMessage = "BB-8";

    logger.debug(debugMessage);
    expect(MockWriter).to.have.been.calledWith(sinon.match(debugMessage));

    logger.info(infoMessage);
    expect(MockWriter).to.have.been.calledWith(sinon.match(infoMessage));

    logger.print(printMessage);
    expect(MockWriter).to.have.been.calledWith(sinon.match(printMessage));

    logger.warn(warnMessage);
    expect(MockWriter).to.have.been.calledWith(sinon.match(warnMessage));
  });
});
