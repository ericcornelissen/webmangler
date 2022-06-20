import type { ManglerStats, Reporter } from "../../types";

import { expect, use as chaiUse } from "chai";
import * as sinonChai from "sinon-chai";

import { WriterMock } from "../common";

import JsonReporter from "../../json-reporter";

chaiUse(sinonChai);

suite("JsonReporter", function() {
  let reporter: Reporter;

  let writer: WriterMock;

  suiteSetup(function() {
    writer = new WriterMock();

    reporter = new JsonReporter();
  });

  setup(function() {
    writer.write.resetHistory();
  });

  suite("::report", function() {
    test("placeholder test", function() {
      const manglerStats: ManglerStats = {
        aggregate: {
          changed: false,
          changePercentage: 0,
          sizeBefore: 0,
          sizeAfter: 0,
        },
        duration: 0,
        files: new Map(),
      };

      reporter.report(writer, manglerStats);
      expect(writer.write).to.have.been.calledOnce;
    });
  });
});
