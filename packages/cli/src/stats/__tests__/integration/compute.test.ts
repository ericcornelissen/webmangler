import * as path from "path";

import { expect } from "chai";

import WebManglerCliFileMock from "../common/file.mock";

import {
  computeStats,
} from "../../index";

suite("Compute stats", function() {
  test("no files", function() {
    const duration = 3.14;

    const result = computeStats({
      duration,
      inFiles: [],
      outFiles: [],
    });

    expect(result).to.deep.equal({
      aggregate: {
        changed: false,
        changePercentage: NaN,
        sizeBefore: 0,
        sizeAfter: 0,
      },
      duration,
      files: new Map(),
    });
  });

  test("some files", function() {
    const duration = 42;

    const result = computeStats({
      duration,
      inFiles: [
        new WebManglerCliFileMock({
          path: pathToTestdata("sample.css"),
          originalSize: 10,
        }),
        new WebManglerCliFileMock({
          path: pathToTestdata("sample.html"),
          originalSize: 30,
        }),
        new WebManglerCliFileMock({
          path: pathToTestdata("sample.js"),
          originalSize: 10,
        }),
      ],
      outFiles: [
        new WebManglerCliFileMock({
          path: pathToTestdata("sample.css"),
          size: 3,
        }),
        new WebManglerCliFileMock({
          path: pathToTestdata("sample.html"),
          size: 12,
        }),
      ],
    });

    expect(result).to.deep.equal({
      aggregate: {
        changed: true,
        changePercentage: -50,
        sizeBefore: 50,
        sizeAfter: 25,
      },
      duration,
      files: new Map([
        ["/testdata/sample.css", {
          changed: true,
          changePercentage: -70,
          sizeBefore: 10,
          sizeAfter: 3,
        }],
        ["/testdata/sample.html", {
          changed: true,
          changePercentage: -60,
          sizeBefore: 30,
          sizeAfter: 12,
        }],
        ["/testdata/sample.js", {
          changed: false,
          changePercentage: 0,
          sizeBefore: 10,
          sizeAfter: 10,
        }],
      ]),
    });
  });
});

const pathToTestdata = (...pathInTestdata: string[]): string => path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "..",
  "..",
  "testdata",
  ...pathInTestdata,
);
