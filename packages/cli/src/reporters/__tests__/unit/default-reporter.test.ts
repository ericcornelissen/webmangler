import type { FileStats } from "../../../stats/types";
import type { ManglerStats, Reporter } from "../../types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { FileStatsMock, WriterMock } from "../common";

import DefaultReporter from "../../default-reporter";

chaiUse(sinonChai);

suite("DefaultReporter", function() {
  let reporter: Reporter;

  let writer: WriterMock;

  suiteSetup(function() {
    writer = new WriterMock();

    reporter = new DefaultReporter();
  });

  setup(function() {
    writer.write.resetHistory();
  });

  suite("::report", function() {
    const round = (x: number): number => {
      return Math.round((x + Number.EPSILON) * 100) / 100;
    };

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
        sinon.match("Nothing was mangled"),
      );
    });

    test("one file in stats", function() {
      const path = "foo.bar";
      const fileStats = new FileStatsMock(10, 5);
      const stats: ManglerStats = {
        aggregate: {
          changed: true,
          changePercentage: -50,
          sizeBefore: 10,
          sizeAfter: 5,
        },
        duration: 0,
        files: new Map([[path, fileStats]]),
      };

      reporter.report(writer, stats);
      expect(writer.write).to.have.callCount(3);
      expect(writer.write).to.have.been.calledWith(sinon.match(path));
    });

    test("multiple files in stats", function() {
      const entries: [string, FileStats][] = [
        ["foo.txt", new FileStatsMock(3, 14)],
        ["bar.md", new FileStatsMock(2, 718)],
        ["hello/world.css", new FileStatsMock(16, 7)],
      ];
      const stats: ManglerStats = {
        aggregate: {
          changed: true,
          changePercentage: 3419.05,
          sizeBefore: 21,
          sizeAfter: 739,
        },
        duration: 0,
        files: new Map(entries),
      };

      reporter.report(writer, stats);
      expect(writer.write).to.have.callCount(entries.length + 2);
      for (const [path] of entries) {
        expect(writer.write).to.have.been.calledWith(sinon.match(path));
      }
    });

    test("file that was not mangled", function() {
      const entries: [string, FileStats][] = [
        ["foo.bar", new FileStatsMock(1, 1)],
      ];
      const stats: ManglerStats = {
        aggregate: {
          changed: false,
          changePercentage: 0,
          sizeBefore: 1,
          sizeAfter: 1,
        },
        duration: 0,
        files: new Map(entries),
      };

      reporter.report(writer, stats);
      expect(writer.write).to.have.callCount(entries.length + 2);
      for (const [path] of entries) {
        expect(writer.write).to.have.been.calledWith(sinon.match(path));
        expect(writer.write).to.have.been.calledWith(sinon.match("[NOT MANGLED]"));
      }
    });

    test("negative percentage between -0.01 and -100", function() {
      const entries: [string, FileStats][] = [
        ["correct.txt", new FileStatsMock(0, 1, -0.01)],
        ["horse.txt", new FileStatsMock(0, 1, -0.1)],
        ["battery.txt", new FileStatsMock(0, 1, -1)],
        ["staple.txt", new FileStatsMock(0, 1, -10)],
        ["but.txt", new FileStatsMock(0, 1, -0.015)],
        ["why.txt", new FileStatsMock(0, 1, -0.154)],
        ["is.txt", new FileStatsMock(0, 1, -0.155)],
        ["the.txt", new FileStatsMock(0, 1, -1.124)],
        ["rum.txt", new FileStatsMock(0, 1, -1.125)],
        ["gone.txt", new FileStatsMock(0, 1, -10.128)],
      ];
      const stats: ManglerStats = {
        aggregate: {
          changed: false,
          changePercentage: 0,
          sizeBefore: 0,
          sizeAfter: 0,
        },
        duration: 0,
        files: new Map(entries),
      };

      reporter.report(writer, stats);
      expect(writer.write).to.have.callCount(entries.length + 2);
      for (const [, fileStats] of entries) {
        expect(writer.write).to.have.been.calledWith(
          sinon.match(`${round(fileStats.changePercentage)}%`),
        );
        expect(writer.write).to.have.been.calledWith(
          sinon.match(`(${fileStats.sizeBefore} -> ${fileStats.sizeAfter})`),
        );
      }
      expect(writer.write).not.to.have.been.calledWith(sinon.match("<-0.01%"));
    });

    test("negative percentage between 0 and -0.01", function() {
      const entries: [string, FileStats][] = [
        ["praise.txt", new FileStatsMock(0, 1, -0.009)],
        ["the.txt", new FileStatsMock(0, 1, -0.001)],
        ["sun.txt", new FileStatsMock(0, 1, -0.0001)],
      ];
      const stats: ManglerStats = {
        aggregate: {
          changed: false,
          changePercentage: 0,
          sizeBefore: 0,
          sizeAfter: 0,
        },
        duration: 0,
        files: new Map(entries),
      };

      reporter.report(writer, stats);
      expect(writer.write).to.have.callCount(entries.length + 2);
      for (const [, fileStats] of entries) {
        expect(writer.write).to.have.been.calledWith(sinon.match("<-0.01%"));
        expect(writer.write).to.have.been.calledWith(
          sinon.match(`(${fileStats.sizeBefore} -> ${fileStats.sizeAfter})`),
        );
      }
    });

    test("positive percentage between 0.01 and 100", function() {
      const entries: [string, FileStats][] = [
        ["correct.txt", new FileStatsMock(0, 1, 0.01)],
        ["horse.txt", new FileStatsMock(0, 1, 0.1)],
        ["battery.txt", new FileStatsMock(0, 1, 1)],
        ["staple.txt", new FileStatsMock(0, 1, 10)],
        ["but.txt", new FileStatsMock(0, 1, 0.015)],
        ["why.txt", new FileStatsMock(0, 1, 0.154)],
        ["is.txt", new FileStatsMock(0, 1, 0.155)],
        ["the.txt", new FileStatsMock(0, 1, 1.124)],
        ["rum.txt", new FileStatsMock(0, 1, 1.125)],
        ["gone.txt", new FileStatsMock(0, 1, 10.128)],
      ];
      const stats: ManglerStats = {
        aggregate: {
          changed: false,
          changePercentage: 0,
          sizeBefore: 0,
          sizeAfter: 0,
        },
        duration: 0,
        files: new Map(entries),
      };

      reporter.report(writer, stats);
      expect(writer.write).to.have.callCount(entries.length + 2);
      for (const [, fileStats] of entries) {
        expect(writer.write).to.have.been.calledWith(
          sinon.match(`${round(fileStats.changePercentage)}%`),
        );
        expect(writer.write).to.have.been.calledWith(
          sinon.match(`(${fileStats.sizeBefore} -> ${fileStats.sizeAfter})`),
        );
      }
      expect(writer.write).not.to.have.been.calledWith(sinon.match("<+0.01%"));
    });

    test("positive percentage between 0 and 0.01", function() {
      const entries: [string, FileStats][] = [
        ["praise.txt", new FileStatsMock(0, 1, 0.009)],
        ["the.txt", new FileStatsMock(0, 1, 0.001)],
        ["sun.txt", new FileStatsMock(0, 1, 0.0001)],
      ];
      const stats: ManglerStats = {
        aggregate: {
          changed: false,
          changePercentage: 0,
          sizeBefore: 0,
          sizeAfter: 0,
        },
        duration: 0,
        files: new Map(entries),
      };

      reporter.report(writer, stats);
      expect(writer.write).to.have.callCount(entries.length + 2);
      for (const [, fileStats] of entries) {
        expect(writer.write).to.have.been.calledWith(sinon.match("<+0.01%"));
        expect(writer.write).to.have.been.calledWith(
          sinon.match(`(${fileStats.sizeBefore} -> ${fileStats.sizeAfter})`),
        );
      }
    });

    test("percentage is exactly 0", function() {
      const entries: [string, FileStats][] = [
        ["foo.bar", new FileStatsMock(0, 1, 0)],
      ];
      const stats: ManglerStats = {
        aggregate: {
          changed: false,
          changePercentage: 0,
          sizeBefore: 0,
          sizeAfter: 0,
        },
        duration: 0,
        files: new Map(entries),
      };

      reporter.report(writer, stats);
      expect(writer.write).to.have.callCount(entries.length + 2);
      for (const [,] of entries) {
        expect(writer.write).to.have.been.calledWith(sinon.match("0%"));
      }
    });

    test("overall percentage", function() {
      const aggregate = {
        changed: false,
        changePercentage: -60,
        sizeBefore: 10,
        sizeAfter: 4,
      };

      const stats: ManglerStats = {
        aggregate,
        duration: 0,
        files: new Map([
          ["foo.bar", new FileStatsMock(5, 3)],
          ["foo.bar", new FileStatsMock(5, 1)],
        ]),
      };

      reporter.report(writer, stats);
      expect(writer.write).to.have.been.calledWith(
        sinon.match(`${aggregate.changePercentage}%`),
      );
      expect(writer.write).to.have.been.calledWith(
        sinon.match(`(${aggregate.sizeBefore} -> ${aggregate.sizeAfter})`),
      );
    });

    test("duration", function() {
      const duration = 42;
      const stats: ManglerStats = {
        aggregate: {
          changed: false,
          changePercentage: 50,
          sizeBefore: 2,
          sizeAfter: 1,
        },
        duration: duration,
        files: new Map([["foo.bar", new FileStatsMock(2, 1)]]),
      };

      reporter.report(writer, stats);
      expect(writer.write).to.have.been.calledWith(
        sinon.match(`${duration} ms`),
      );
    });
  });
});
