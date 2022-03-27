import { expect, use as chaiUse } from "chai";
import * as sinonChai from "sinon-chai";

import { WriterMock } from "../common";

import * as reporters from "../../index";

chaiUse(sinonChai);

suite("Reporters", function() {
  suite("::New", function() {
    let writer: WriterMock;

    suiteSetup(function() {
      writer = new WriterMock();
    });

    setup(function() {
      writer.write.resetHistory();
    });

    test("writer is unused during reporter creation", function() {
      reporters.New(writer);
      expect(writer.write).not.to.have.been.called;
    });

    test("reporter can write a report", function() {
      const stats = {
        aggregate: {
          changed: false,
          changePercentage: 0,
          sizeBefore: 10,
          sizeAfter: 10,
        },
        duration: 0,
        files: new Map(),
      };

      const reporter = reporters.New(writer);
      expect(() => reporter.report(writer, stats)).not.to.throw();
    });
  });
});
