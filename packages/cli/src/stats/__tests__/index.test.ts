import type { FileStats, ManglerStats } from "../types";
import type { WebManglerCliFile } from "../../fs";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import FileStatsMock from "../__mocks__/file-stats.mock";
import WebManglerCliFileMock from "../../fs/__mocks__/file.mock";

import { getStatsBetween, logStats } from "../index";

chaiUse(sinonChai);

suite("Statistics", function() {
  suite("::getStatsBetween", function() {
    const scenarios: {
      name: string,
      cases: {
        expected: {
          filePath: string,
          changed: boolean,
          sizeBefore?: number,
          sizeAfter?: number,
        }[],
        inFiles: WebManglerCliFile[],
        outFiles: WebManglerCliFile[],
      }[],
    }[] = [
      {
        name: "sample",
        cases: [
          {
            inFiles: [
              new WebManglerCliFileMock({
                path: "foo.bar",
                originalSize: 3.14,
              }),
            ],
            outFiles: [
              new WebManglerCliFileMock({
                path: "foo.bar",
                size: 2.718,
              }),
            ],
            expected: [
              {
                filePath: "foo.bar",
                changed: true,
                sizeBefore: 3.14,
                sizeAfter: 2.718,
              },
            ],
          },
          {
            inFiles: [
              new WebManglerCliFileMock({
                path: "foo.bar",
                originalSize: 3.14,
              }),
            ],
            outFiles: [],
            expected: [
              {
                filePath: "foo.bar",
                changed: false,
              },
            ],
          },
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            inFiles: [],
            outFiles: [],
            expected: [],
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            inFiles,
            outFiles,
            expected,
          } = testCase;

          const result = getStatsBetween(inFiles, outFiles);
          expect(result.size).to.equal(expected.length);
          for (const expectedI of expected) {
            const {
              filePath,
              changed,
              sizeBefore,
              sizeAfter,
            } = expectedI;

            const fileStats = result.get(filePath) as FileStats;
            expect(fileStats).not.to.be.undefined;
            expect(fileStats.changed).to.equal(changed);

            if (changed) {
              expect(fileStats.changePercentage).not.to.equal(0);
              expect(fileStats.sizeBefore).to.equal(sizeBefore);
              expect(fileStats.sizeAfter).to.equal(sizeAfter);
            }
          }
        }
      });
    }
  });

  suite("::logStats", function() {
    const round = (x: number): number => Math.round((x + Number.EPSILON) * 100) / 100;

    const logMock = sinon.fake();

    setup(function() {
      logMock.resetHistory();
    });

    test("no files in ManglerStats", function() {
      const emptyStats: ManglerStats = new Map([]);

      logStats(logMock, emptyStats);
      expect(logMock).not.to.have.been.called;
    });

    test("one file in ManglerStats", function() {
      const path = "foo.bar";
      const fileStats = new FileStatsMock(10, 5);
      const stats: ManglerStats = new Map([[path, fileStats]]);

      logStats(logMock, stats);
      expect(logMock).to.have.callCount(2);
      expect(logMock).to.have.been.calledWith(sinon.match(path));
    });

    test("multiple files in ManglerStats", function() {
      const entries: [string, FileStats][] = [
        ["foo.txt", new FileStatsMock(3, 14)],
        ["bar.md", new FileStatsMock(2, 718)],
        ["hello/world.css", new FileStatsMock(16, 7)],
      ];
      const stats: ManglerStats = new Map(entries);

      logStats(logMock, stats);
      expect(logMock).to.have.callCount(entries.length + 1);
      for (const [path] of entries) {
        expect(logMock).to.have.been.calledWith(sinon.match(path));
      }
    });

    test("file that was not mangled", function() {
      const entries: [string, FileStats][] = [
        ["foo.bar", new FileStatsMock(1, 1)],
      ];
      const stats: ManglerStats = new Map(entries);

      logStats(logMock, stats);
      expect(logMock).to.have.callCount(entries.length + 1);
      for (const [path] of entries) {
        expect(logMock).to.have.been.calledWith(sinon.match(path));
        expect(logMock).to.have.been.calledWith(sinon.match("[NOT MANGLED]"));
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
      const stats: ManglerStats = new Map(entries);

      logStats(logMock, stats);
      expect(logMock).to.have.callCount(entries.length + 1);
      for (const [, fileStats] of entries) {
        expect(logMock).to.have.been.calledWith(
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
      const stats: ManglerStats = new Map(entries);

      logStats(logMock, stats);
      expect(logMock).to.have.callCount(entries.length + 1);
      for (const [,] of entries) {
        expect(logMock).to.have.been.calledWith(sinon.match("<-0.01%"));
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
      const stats: ManglerStats = new Map(entries);

      logStats(logMock, stats);
      expect(logMock).to.have.callCount(entries.length + 1);
      for (const [, fileStats] of entries) {
        expect(logMock).to.have.been.calledWith(
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
      const stats: ManglerStats = new Map(entries);

      logStats(logMock, stats);
      expect(logMock).to.have.callCount(entries.length + 1);
      for (const [,] of entries) {
        expect(logMock).to.have.been.calledWith(sinon.match("<+0.01%"));
      }
    });

    test("percentage is exactly 0", function() {
      const entries: [string, FileStats][] = [
        ["foo.bar", new FileStatsMock(0, 1, 0)],
      ];
      const stats: ManglerStats = new Map(entries);

      logStats(logMock, stats);
      expect(logMock).to.have.callCount(entries.length + 1);
      for (const [,] of entries) {
        expect(logMock).to.have.been.calledWith(sinon.match("0%"));
      }
    });

    test("overall percentage", function() {
      const entries: [string, FileStats][] = [
        ["foo.txt", new FileStatsMock(2, 1)],
        ["bar.md", new FileStatsMock(3, 1)],
        ["hello/world.css", new FileStatsMock(5, 2)],
      ];
      const stats: ManglerStats = new Map(entries);

      const sizeBefore = entries.map(([, file]) => file.sizeBefore).reduce((p, c) => c + p, 0);
      const sizeAfter = entries.map(([, file]) => file.sizeAfter).reduce((p, c) => c + p, 0);

      logStats(logMock, stats);
      expect(logMock).to.have.been.calledWith(sinon.match("-60%"));
      expect(logMock).to.have.been.calledWith(sinon.match(`${sizeBefore} -> ${sizeAfter}`));
    });
  });
});
