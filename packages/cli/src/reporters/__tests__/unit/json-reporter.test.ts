import type { FileStats } from "../../../stats/types";
import type { ManglerStats, Reporter } from "../../types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { FileStatsMock, WriterMock } from "../common";

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
    test("the duration", function() {
      const emptyStats: ManglerStats = {
        aggregate: {
          changed: false,
          changePercentage: 0,
          sizeBefore: 0,
          sizeAfter: 0,
        },
        duration: 3.14,
        files: new Map([]),
      };

      reporter.report(writer, emptyStats);
      expect(writer.write).to.have.been.calledWith(
        sinon.match(/^\{.*"duration":3.1.*\}$/),
      );
    });

    suite("Aggregate", function() {
      test("reports changed", function() {
        const emptyStats: ManglerStats = {
          aggregate: {
            changed: true,
            changePercentage: -50,
            sizeBefore: 10,
            sizeAfter: 5,
          },
          duration: 0,
          files: new Map([]),
        };

        reporter.report(writer, emptyStats);
        expect(writer.write).to.have.been.calledWith(
          sinon.match(/^\{.*"aggregate":\{.*"changed":true.*\}.*\}$/),
        );
      });

      test("reports the percentage", function() {
        const emptyStats: ManglerStats = {
          aggregate: {
            changed: true,
            changePercentage: 3.14,
            sizeBefore: 14,
            sizeAfter: 3,
          },
          duration: 0,
          files: new Map([]),
        };

        reporter.report(writer, emptyStats);
        expect(writer.write).to.have.been.calledWith(
          sinon.match(/^\{.*"aggregate":\{.*"changePercentage":3.14.*\}.*\}$/),
        );
      });

      test("reports the size before", function() {
        const emptyStats: ManglerStats = {
          aggregate: {
            changed: true,
            changePercentage: -50,
            sizeBefore: 10,
            sizeAfter: 5,
          },
          duration: 0,
          files: new Map([]),
        };

        reporter.report(writer, emptyStats);
        expect(writer.write).to.have.been.calledWith(
          sinon.match(/^\{.*"aggregate":\{.*"sizeBefore":10.*\}.*\}$/),
        );
      });

      test("reports the size after", function() {
        const emptyStats: ManglerStats = {
          aggregate: {
            changed: true,
            changePercentage: -50,
            sizeBefore: 10,
            sizeAfter: 5,
          },
          duration: 0,
          files: new Map([]),
        };

        reporter.report(writer, emptyStats);
        expect(writer.write).to.have.been.calledWith(
          sinon.match(/^\{.*"aggregate":\{.*"sizeAfter":5.*\}.*\}$/),
        );
      });
    });

    suite("Files", function() {
      test("no files in stats", function() {
        const emptyStats: ManglerStats = {
          aggregate: {
            changed: false,
            changePercentage: 0,
            sizeBefore: 0,
            sizeAfter: 0,
          },
          duration: 0,
          files: new Map([]),
        };

        reporter.report(writer, emptyStats);
        expect(writer.write).to.have.been.calledWith(
          sinon.match(/^\{.*"perFile":\{\}.*\}$/),
        );
      });

      test("one file", function() {
        const fileName = "foo.bar";
        const fileStats = new FileStatsMock(3, 14);

        const files: [string, FileStats][] = [[fileName, fileStats]];

        const stats: ManglerStats = {
          aggregate: {
            changed: false,
            changePercentage: 0,
            sizeBefore: 0,
            sizeAfter: 0,
          },
          duration: 0,
          files: new Map(files),
        };

        reporter.report(writer, stats);
        expect(writer.write).to.have.been.calledWith(
          sinon.match(
            new RegExp(`^\\{.*"perFile":\\{"${fileName}":\\{.*\\}\\}.*\\}$`),
          ),
        );
        expect(writer.write).to.have.been.calledWith(
          sinon.match(
            new RegExp(
              `
              ^\\{.*"${fileName}":
                \\{.*"changed":${fileStats.changed}.*\\}.*
              \\}$`.replace(/\s/g, ""),
            ),
          ),
        );
        expect(writer.write).to.have.been.calledWith(
          sinon.match(
            new RegExp(
              `
              ^\\{.*"${fileName}":
                \\{.*"changePercentage":${fileStats.changePercentage}.*\\}.*
              \\}$`.replace(/\s/g, ""),
            ),
          ),
        );
        expect(writer.write).to.have.been.calledWith(
          sinon.match(
            new RegExp(
              `
              ^\\{.*"${fileName}":
                \\{.*"sizeBefore":${fileStats.sizeBefore}.*\\}.*
              \\}$`.replace(/\s/g, ""),
            ),
          ),
        );
        expect(writer.write).to.have.been.calledWith(
          sinon.match(
            new RegExp(
              `
              ^\\{.*"${fileName}":
                \\{.*"sizeAfter":${fileStats.sizeAfter}.*\\}.*
              \\}$`.replace(/\s/g, ""),
            ),
          ),
        );
      });

      test("multiple file", function() {
        const files: [string, FileStats][] = [
          ["foo.txt", new FileStatsMock(3, 14)],
          ["bar.md", new FileStatsMock(2, 718)],
          ["hello/world.css", new FileStatsMock(16, 7)],
        ];

        const stats: ManglerStats = {
          aggregate: {
            changed: false,
            changePercentage: 0,
            sizeBefore: 0,
            sizeAfter: 0,
          },
          duration: 0,
          files: new Map(files),
        };

        reporter.report(writer, stats);

        for (const [fileName, fileStats] of files) {
          expect(writer.write).to.have.been.calledWith(
            sinon.match(
              new RegExp(
                `^\\{.*"perFile":\\{.*"${fileName}":\\{.*\\}.*\\}.*\\}$`,
              ),
            ),
          );
          expect(writer.write).to.have.been.calledWith(
            sinon.match(
              new RegExp(
                `
                ^\\{.*"${fileName}":
                  \\{.*"changed":${fileStats.changed}.*\\}.*
                \\}$`.replace(/\s/g, ""),
              ),
            ),
          );
          expect(writer.write).to.have.been.calledWith(
            sinon.match(
              new RegExp(
                `
                ^\\{.*"${fileName}":
                  \\{.*"changePercentage":${fileStats.changePercentage}.*\\}.*
                \\}$`.replace(/\s/g, ""),
              ),
            ),
          );
          expect(writer.write).to.have.been.calledWith(
            sinon.match(
              new RegExp(
                `
                ^\\{.*"${fileName}":
                  \\{.*"sizeBefore":${fileStats.sizeBefore}.*\\}.*
                \\}$`.replace(/\s/g, ""),
              ),
            ),
          );
          expect(writer.write).to.have.been.calledWith(
            sinon.match(
              new RegExp(
                `
                ^\\{.*"${fileName}":
                  \\{.*"sizeAfter":${fileStats.sizeAfter}.*\\}.*
                \\}$`.replace(/\s/g, ""),
              ),
            ),
          );
        }
      });
    });
  });
});
