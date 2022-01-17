import type { TestScenarios } from "@webmangler/testing";
import type { WebManglerCliFile } from "../../../fs";

import { expect } from "chai";

import WebManglerCliFileMock from "../common/file.mock";
import LoggerMock from "../common/logger.mock";

import {
  computeStats,
  logStats,
} from "../../index";

suite("Log stats", function() {
  let logger: LoggerMock;

  suiteSetup(function() {
    logger = new LoggerMock();
  });

  setup(function() {
    logger.resetHistory();
  });

  interface TestCase {
    readonly duration: number;
    readonly inFiles: WebManglerCliFile[];
    readonly outFiles: WebManglerCliFile[];
  }

  const scenarios: TestScenarios<TestCase> = [
    {
      testName: "no files",
      getScenario: () => ({
        duration: 1,
        inFiles: [],
        outFiles: [],
      }),
    },
    {
      testName: "some files",
      getScenario: () => ({
        duration: 1,
        inFiles: [
          new WebManglerCliFileMock({
            path: "some.decrease",
            originalSize: 3.14,
          }),
          new WebManglerCliFileMock({
            path: "small.decrease",
            originalSize: 100000,
          }),
          new WebManglerCliFileMock({
            path: "some.increase",
            originalSize: 2.718,
          }),
          new WebManglerCliFileMock({
            path: "small.increase",
            originalSize: 100000,
          }),
          new WebManglerCliFileMock({
            path: "unchanged",
            originalSize: 42,
          }),
        ],
        outFiles: [
          new WebManglerCliFileMock({
            path: "some.decrease",
            size: 2.718,
          }),
          new WebManglerCliFileMock({
            path: "small.decrease",
            size: 99999,
          }),
          new WebManglerCliFileMock({
            path: "some.increase",
            size: 3.14,
          }),
          new WebManglerCliFileMock({
            path: "small.increase",
            size: 100001,
          }),
        ],
      }),
    },
  ];

  for (const { getScenario, testName } of scenarios) {
    test(testName, function() {
      const scenario = getScenario();
      const stats = computeStats(scenario);
      logStats(logger, stats);
      expect(logger.print).to.have.been.called;
    });
  }
});
