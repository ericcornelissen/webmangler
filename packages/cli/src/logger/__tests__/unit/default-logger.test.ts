import type { SinonStub } from "sinon";

import type { LogLevel } from "../../level";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { initDefaultLogger } from "../../default-logger";

chaiUse(sinonChai);

suite("DefaultLogger", function() {
  let DefaultLogger: ReturnType<typeof initDefaultLogger>;

  let isDebug: SinonStub;
  let isInfo: SinonStub;
  let isSilent: SinonStub;
  let isWarn: SinonStub;
  let writer: SinonStub;

  const logLevels: Iterable<LogLevel> = [-1, 0, 1, 2];

  suiteSetup(function() {
    isDebug = sinon.stub();
    isInfo = sinon.stub();
    isSilent = sinon.stub();
    isWarn = sinon.stub();
    writer = sinon.stub();

    DefaultLogger = initDefaultLogger({
      isDebug,
      isInfo,
      isSilent,
      isWarn,
    });
  });

  setup(function() {
    writer.resetHistory();
  });

  suite("::debug", function() {
    const message = "Why not Zoidberg?";

    setup(function() {
      isDebug.resetHistory();
    });

    test("check isDebug", function() {
      for (const logLevel of logLevels) {
        expect(isDebug).not.to.have.been.calledWith(logLevel);
        new DefaultLogger(logLevel, writer);
        expect(isDebug).to.have.been.calledWith(logLevel);
      }
    });

    test("enabled", function() {
      isDebug.returns(true);

      const logger = new DefaultLogger(-1, writer);
      logger.debug(message);

      expect(writer).to.have.been.calledWith(`[DEBUG] ${message}`);
    });

    test("disabled", function() {
      isDebug.returns(false);

      const logger = new DefaultLogger(-1, writer);
      logger.debug(message);

      expect(writer).not.to.have.been.calledWith(sinon.match(message));
    });
  });

  suite("::info", function() {
    const message = "Praise the Sun";

    setup(function() {
      isInfo.resetHistory();
    });

    test("check isInfo", function() {
      for (const logLevel of logLevels) {
        expect(isInfo).not.to.have.been.calledWith(logLevel);
        new DefaultLogger(logLevel, writer);
        expect(isInfo).to.have.been.calledWith(logLevel);
      }
    });

    test("enabled", function() {
      isInfo.returns(true);

      const logger = new DefaultLogger(-1, writer);
      logger.info(message);

      expect(writer).to.have.been.calledWith(`[INFO]  ${message}`);
    });

    test("disabled", function() {
      isInfo.returns(false);

      const logger = new DefaultLogger(-1, writer);
      logger.info(message);

      expect(writer).not.to.have.been.calledWith(sinon.match(message));
    });
  });

  suite("::print", function() {
    const message = "Lorem ipsum dolor sit";

    setup(function() {
      isSilent.resetHistory();
    });

    test("check isSilent", function() {
      for (const logLevel of logLevels) {
        expect(isSilent).not.to.have.been.calledWith(logLevel);
        new DefaultLogger(logLevel, writer);
        expect(isSilent).to.have.been.calledWith(logLevel);
      }
    });

    test("enabled", function() {
      isSilent.returns(false);

      const logger = new DefaultLogger(-1, writer);
      logger.print(message);

      expect(writer).to.have.been.calledWith(message);
    });

    test("disabled", function() {
      isSilent.returns(true);

      const logger = new DefaultLogger(-1, writer);
      logger.print(message);

      expect(writer).not.to.have.been.calledWith(sinon.match(message));
    });
  });

  suite("::warn", function() {
    const message = "R2-D2";

    setup(function() {
      isWarn.resetHistory();
    });

    test("check isWarn", function() {
      for (const logLevel of logLevels) {
        expect(isWarn).not.to.have.been.calledWith(logLevel);
        new DefaultLogger(logLevel, writer);
        expect(isWarn).to.have.been.calledWith(logLevel);
      }
    });

    test("enabled", function() {
      isWarn.returns(true);

      const logger = new DefaultLogger(-1, writer);
      logger.warn(message);

      expect(writer).to.have.been.calledWith(`[WARN]  ${message}`);
    });

    test("disabled", function() {
      isWarn.returns(false);

      const logger = new DefaultLogger(-1, writer);
      logger.warn(message);

      expect(writer).not.to.have.been.calledWith(sinon.match(message));
    });
  });
});
