import type { TestScenarios } from "@webmangler/testing";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { newGetRuntimeBudget } from "../../compute";

chaiUse(sinonChai);

suite("Benchmarking budget compute", function() {
  suite("::newGetRuntimeBudget", function() {
    interface TestCase {
      readonly cpuSpeed: number;
      readonly inputBudget: number;
      readonly expected: number;
    }

    const scenarios: TestScenarios<TestCase[]> = [
      {
        testName: "default system",
        getScenario: () => {
          const cpuSpeed = 2500;
          return [
            {
              cpuSpeed,
              inputBudget: 300,
              expected: 300,
            },
            {
              cpuSpeed,
              inputBudget: 250,
              expected: 250,
            },
            {
              cpuSpeed,
              inputBudget: 350,
              expected: 350,
            },
          ];
        },
      },
      {
        testName: "slow system",
        getScenario: () => {
          const cpuSpeed = 2000;
          return [
            {
              cpuSpeed,
              inputBudget: 300,
              expected: 375,
            },
            {
              cpuSpeed,
              inputBudget: 250,
              expected: 312.5,
            },
            {
              cpuSpeed,
              inputBudget: 350,
              expected: 437.5,
            },
          ];
        },
      },
      {
        testName: "fast system",
        getScenario: () => {
          const cpuSpeed = 3000;
          return [
            {
              cpuSpeed,
              inputBudget: 300,
              expected: 250,
            },
            {
              cpuSpeed,
              inputBudget: 250,
              expected: 208 + (1 / 3),
            },
            {
              cpuSpeed,
              inputBudget: 350,
              expected: 291 + (2 / 3),
            },
          ];
        },
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const { cpuSpeed, inputBudget, expected } of getScenario()) {
          const getCpuSpeedInMHz = sinon.stub();
          getCpuSpeedInMHz.returns(cpuSpeed);

          const getRuntimeBudget = newGetRuntimeBudget({
            getCpuSpeedInMHz,
          });

          const result = getRuntimeBudget(inputBudget);
          expect(result).to.equal(expected);
        }
      });
    }
  });
});
