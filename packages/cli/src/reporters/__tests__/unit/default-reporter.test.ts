import type { FileStats } from "../../../stats/types";
import type { Reporter, Stats } from "../../types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { FileStatsMock, WriterMock } from "../common";

import DefaultReporter from "../../default-reporter";

chaiUse(sinonChai);

suite("DefaultReporter", function() {
  // TODO: provide per-test aggregates when the implementation uses the provided
  // aggregate.
  const sampleAggregate = {
    changed: false,
    changePercentage: 0,
    sizeBefore: 10,
    sizeAfter: 10,
  };

  let reporter: Reporter;

  let writer: WriterMock;

  suiteSetup(function() {
    writer = new WriterMock();

    reporter = new DefaultReporter(writer);
  });

  setup(function() {
    writer.write.resetHistory();
  });

  suite("::report", function() {
    const round = (x: number): number => {
      return Math.round((x + Number.EPSILON) * 100) / 100;
    };

    test("no files in stats", function() {
      const emptyStats: Stats = {
        aggregate: sampleAggregate,
        duration: 0,
        files: new Map([]),
      };

      reporter.report(emptyStats);
      expect(writer.write).to.have.been.calledWith(
        sinon.match("Nothing was mangled"),
      );
    });

    test("one file in stats", function() {
      const path = "foo.bar";
      const fileStats = new FileStatsMock(10, 5);
      const stats: Stats = {
        aggregate: sampleAggregate,
        duration: 0,
        files: new Map([[path, fileStats]]),
      };

      reporter.report(stats);
      expect(writer.write).to.have.callCount(3);
      expect(writer.write).to.have.been.calledWith(sinon.match(path));
    });

    test("multiple files in stats", function() {
      const entries: [string, FileStats][] = [
        ["foo.txt", new FileStatsMock(3, 14)],
        ["bar.md", new FileStatsMock(2, 718)],
        ["hello/world.css", new FileStatsMock(16, 7)],
      ];
      const stats: Stats = {
        aggregate: sampleAggregate,
        duration: 0,
        files: new Map(entries),
      };

      reporter.report(stats);
      expect(writer.write).to.have.callCount(entries.length + 2);
      for (const [path] of entries) {
        expect(writer.write).to.have.been.calledWith(sinon.match(path));
      }
    });

    test("file that was not mangled", function() {
      const entries: [string, FileStats][] = [
        ["foo.bar", new FileStatsMock(1, 1)],
      ];
      const stats: Stats = {
        aggregate: sampleAggregate,
        duration: 0,
        files: new Map(entries),
      };

      reporter.report(stats);
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
      const stats: Stats = {
        aggregate: sampleAggregate,
        duration: 0,
        files: new Map(entries),
      };

      reporter.report(stats);
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
      const stats: Stats = {
        aggregate: sampleAggregate,
        duration: 0,
        files: new Map(entries),
      };

      reporter.report(stats);
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
      const stats: Stats = {
        aggregate: sampleAggregate,
        duration: 0,
        files: new Map(entries),
      };

      reporter.report(stats);
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
      const stats: Stats = {
        aggregate: sampleAggregate,
        duration: 0,
        files: new Map(entries),
      };

      reporter.report(stats);
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
      const stats: Stats = {
        aggregate: sampleAggregate,
        duration: 0,
        files: new Map(entries),
      };

      reporter.report(stats);
      expect(writer.write).to.have.callCount(entries.length + 2);
      for (const [,] of entries) {
        expect(writer.write).to.have.been.calledWith(sinon.match("0%"));
      }
    });

    test("overall percentage", function() {
      const entries: [string, FileStats][] = [
        ["foo.txt", new FileStatsMock(2, 1)],
        ["bar.md", new FileStatsMock(3, 1)],
        ["hello/world.css", new FileStatsMock(5, 2)],
      ];
      const stats: Stats = {
        aggregate: sampleAggregate,
        duration: 0,
        files: new Map(entries),
      };

      const sizesBefore = entries.map(([, file]) => file.sizeBefore);
      const sizeBefore = sizesBefore.reduce((total, size) => total + size, 0);

      const sizesAfter = entries.map(([, file]) => file.sizeAfter);
      const sizeAfter = sizesAfter.reduce((total, size) => total + size, 0);

      reporter.report(stats);
      expect(writer.write).to.have.been.calledWith(sinon.match("-60%"));
      expect(writer.write).to.have.been.calledWith(
        sinon.match(`(${sizeBefore} -> ${sizeAfter})`),
      );
    });

    test("duration", function() {
      const duration = 42;
      const stats: Stats = {
        aggregate: sampleAggregate,
        duration: duration,
        files: new Map([["foo.bar", new FileStatsMock(2, 1)]]),
      };

      reporter.report(stats);
      expect(writer.write).to.have.been.calledWith(
        sinon.match(`${duration} ms`),
      );
    });
  });
});
