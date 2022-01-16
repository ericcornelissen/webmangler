import type { FileStats, ManglerStats } from "../../types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import FileStatsMock from "../../__mocks__/file-stats.mock";
import LoggerMock from "../../../logger/__mocks__/logger.mock";

import {
  logStats,
} from "../../log";

chaiUse(sinonChai);

suite("Log stats", function() {
  suite("::logStats", function() {
    const round = (x: number): number => {
      return Math.round((x + Number.EPSILON) * 100) / 100;
    };

    let logger: LoggerMock;

    suiteSetup(function() {
      logger = new LoggerMock();
    });

    setup(function() {
      logger.resetHistory();
    });

    test("no files in ManglerStats", function() {
      const emptyStats: ManglerStats = {
        duration: 0,
        files: new Map([]),
      };

      logStats(logger, emptyStats);
      expect(logger.print).to.have.been.calledWith(
        sinon.match("Nothing was mangled"),
      );
    });

    test("one file in ManglerStats", function() {
      const path = "foo.bar";
      const fileStats = new FileStatsMock(10, 5);
      const stats: ManglerStats = {
        duration: 0,
        files: new Map([[path, fileStats]]),
      };

      logStats(logger, stats);
      expect(logger.print).to.have.callCount(3);
      expect(logger.print).to.have.been.calledWith(sinon.match(path));
    });

    test("multiple files in ManglerStats", function() {
      const entries: [string, FileStats][] = [
        ["foo.txt", new FileStatsMock(3, 14)],
        ["bar.md", new FileStatsMock(2, 718)],
        ["hello/world.css", new FileStatsMock(16, 7)],
      ];
      const stats: ManglerStats = {
        duration: 0,
        files: new Map(entries),
      };

      logStats(logger, stats);
      expect(logger.print).to.have.callCount(entries.length + 2);
      for (const [path] of entries) {
        expect(logger.print).to.have.been.calledWith(sinon.match(path));
      }
    });

    test("file that was not mangled", function() {
      const entries: [string, FileStats][] = [
        ["foo.bar", new FileStatsMock(1, 1)],
      ];
      const stats: ManglerStats = {
        duration: 0,
        files: new Map(entries),
      };

      logStats(logger, stats);
      expect(logger.print).to.have.callCount(entries.length + 2);
      for (const [path] of entries) {
        expect(logger.print).to.have.been.calledWith(sinon.match(path));
        expect(logger.print).to.have.been.calledWith(sinon.match("[NOT MANGLED]"));
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
        duration: 0,
        files: new Map(entries),
      };

      logStats(logger, stats);
      expect(logger.print).to.have.callCount(entries.length + 2);
      for (const [, fileStats] of entries) {
        expect(logger.print).to.have.been.calledWith(
          sinon.match(`${round(fileStats.changePercentage)}%`),
        );
      }
    });

    test("negative percentage between 0 and -0.01", function() {
      const entries: [string, FileStats][] = [
        ["praise.txt", new FileStatsMock(0, 1, -0.009)],
        ["the.txt", new FileStatsMock(0, 1, -0.001)],
        ["sun.txt", new FileStatsMock(0, 1, -0.0001)],
      ];
      const stats: ManglerStats = {
        duration: 0,
        files: new Map(entries),
      };

      logStats(logger, stats);
      expect(logger.print).to.have.callCount(entries.length + 2);
      for (const [,] of entries) {
        expect(logger.print).to.have.been.calledWith(sinon.match("<-0.01%"));
      }
    });

    test("negative percentage between 0.01 and 100", function() {
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
        duration: 0,
        files: new Map(entries),
      };

      logStats(logger, stats);
      expect(logger.print).to.have.callCount(entries.length + 2);
      for (const [, fileStats] of entries) {
        expect(logger.print).to.have.been.calledWith(
          sinon.match(`${round(fileStats.changePercentage)}%`),
        );
      }
    });

    test("positive percentage between 0 and 0.01", function() {
      const entries: [string, FileStats][] = [
        ["praise.txt", new FileStatsMock(0, 1, 0.009)],
        ["the.txt", new FileStatsMock(0, 1, 0.001)],
        ["sun.txt", new FileStatsMock(0, 1, 0.0001)],
      ];
      const stats: ManglerStats = {
        duration: 0,
        files: new Map(entries),
      };

      logStats(logger, stats);
      expect(logger.print).to.have.callCount(entries.length + 2);
      for (const [,] of entries) {
        expect(logger.print).to.have.been.calledWith(sinon.match("<+0.01%"));
      }
    });

    test("percentage is exactly 0", function() {
      const entries: [string, FileStats][] = [
        ["foo.bar", new FileStatsMock(0, 1, 0)],
      ];
      const stats: ManglerStats = {
        duration: 0,
        files: new Map(entries),
      };

      logStats(logger, stats);
      expect(logger.print).to.have.callCount(entries.length + 2);
      for (const [,] of entries) {
        expect(logger.print).to.have.been.calledWith(sinon.match("0%"));
      }
    });

    test("overall percentage", function() {
      const entries: [string, FileStats][] = [
        ["foo.txt", new FileStatsMock(2, 1)],
        ["bar.md", new FileStatsMock(3, 1)],
        ["hello/world.css", new FileStatsMock(5, 2)],
      ];
      const stats: ManglerStats = {
        duration: 0,
        files: new Map(entries),
      };

      const sizesBefore = entries.map(([, file]) => file.sizeBefore);
      const sizeBefore = sizesBefore.reduce((total, size) => total + size, 0);

      const sizesAfter = entries.map(([, file]) => file.sizeAfter);
      const sizeAfter = sizesAfter.reduce((total, size) => total + size, 0);

      logStats(logger, stats);
      expect(logger.print).to.have.been.calledWith(sinon.match("-60%"));
      expect(logger.print).to.have.been.calledWith(
        sinon.match(`${sizeBefore} -> ${sizeAfter}`),
      );
    });

    test("duration", function() {
      const duration = 42;
      const stats: ManglerStats = {
        duration: duration,
        files: new Map([["foo.bar", new FileStatsMock(2, 1)]]),
      };

      logStats(logger, stats);
      expect(logger.print).to.have.been.calledWith(
        sinon.match(`${duration} ms`),
      );
    });
  });
});
