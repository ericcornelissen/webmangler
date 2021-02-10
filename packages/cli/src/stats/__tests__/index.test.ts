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
      expect(logMock).to.have.callCount(1);
      expect(logMock).to.have.been.calledWith(sinon.match(path));
      expect(logMock).to.have.been.calledWith(
        sinon.match(`${fileStats.changePercentage}%`),
      );
    });

    test("multiple files in ManglerStats", function() {
      const entries: [string, FileStats][] = [
        ["foo.txt", new FileStatsMock(3, 14)],
        ["bar.md", new FileStatsMock(2, 718)],
        ["hello/world.css", new FileStatsMock(16, 7)],
      ];
      const stats: ManglerStats = new Map(entries);

      logStats(logMock, stats);
      expect(logMock).to.have.callCount(entries.length);
      for (const [path, fileStats] of entries) {
        expect(logMock).to.have.been.calledWith(sinon.match(path));
        expect(logMock).to.have.been.calledWith(
          sinon.match(`${fileStats.changePercentage}%`),
        );
      }
    });
  });
});
