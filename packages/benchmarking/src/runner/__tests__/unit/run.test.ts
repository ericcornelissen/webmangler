import type { TestScenarios } from "@webmangler/testing";
import type { SinonSpy, SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import {
  newDoBenchmark,
  newMeasureOneRun,
} from "../../run";

chaiUse(sinonChai);

suite("Benchmarking runner runners", function() {
  suite("::newDoBenchmark", function() {
    let doBenchmark: ReturnType<typeof newDoBenchmark>;

    let config: {
      getRepetitions: SinonStub;
      getSetupFn: SinonStub;
    };
    let measureOneRun: SinonStub;
    let setupFn: SinonSpy;

    const repetitions = 10;
    const benchmarkParameters = {
      // The values here are deliberately different from those returned by the
      // config utility to be able to tell when the config utility isn't used.
      fn: sinon.fake(),
      setup: sinon.fake(),
      repetitions: repetitions + 1,
    };

    suiteSetup(function() {
      config = {
        getRepetitions: sinon.stub(),
        getSetupFn: sinon.stub(),
      };
      measureOneRun = sinon.stub();
      setupFn = sinon.fake();

      doBenchmark = newDoBenchmark({
        config,
        measureOneRun,
      });
    });

    setup(function() {
      config.getRepetitions.returns(repetitions);
      config.getSetupFn.returns(setupFn);
    });

    suite("Config", function() {
      setup(function() {
        config.getRepetitions.resetHistory();
        config.getSetupFn.resetHistory();
      });

      test("gets repetitions through config utilities", function() {
        doBenchmark(benchmarkParameters);
        expect(config.getRepetitions).to.have.callCount(1);
        expect(config.getRepetitions).to.have.been.calledWithExactly(
          benchmarkParameters,
        );
      });

      test("gets setup through config utilities", function() {
        doBenchmark(benchmarkParameters);
        expect(config.getSetupFn).to.have.callCount(1);
        expect(config.getSetupFn).to.have.been.calledWithExactly(
          benchmarkParameters,
        );
      });
    });

    suite("Setup", function() {
      setup(function() {
        measureOneRun.resetHistory();
        setupFn.resetHistory();
      });

      test("sets up once for every repetition", function() {
        doBenchmark(benchmarkParameters);
        expect(setupFn).to.have.callCount(repetitions);
      });

      test("sets up before benchmarking", function() {
        doBenchmark(benchmarkParameters);
        expect(setupFn).to.have.been.calledImmediatelyBefore(measureOneRun);
      });
    });

    suite("Benchmark", function() {
      setup(function() {
        measureOneRun.resetHistory();
      });

      test("benchmarks 'repetition' number of times", function() {
        doBenchmark(benchmarkParameters);
        expect(measureOneRun).to.have.callCount(repetitions);
      });

      test("measures the benchmark callback", function() {
        doBenchmark(benchmarkParameters);
        expect(measureOneRun).to.have.been.calledWithExactly(
          benchmarkParameters.fn,
        );
      });
    });
  });

  suite("::newMeasureOneRun", function() {
    let measureOneRun: ReturnType<typeof newMeasureOneRun>;

    let benchmarkCallback: SinonSpy;
    let getNow: SinonStub;

    suiteSetup(function() {
      benchmarkCallback = sinon.fake();
      getNow = sinon.stub();

      measureOneRun = newMeasureOneRun({
        getNow,
      });
    });

    setup(function() {
      benchmarkCallback.resetHistory();
      getNow.resetHistory();
    });

    interface TestCase {
      readonly startTime: number;
      readonly endTime: number;
      readonly expected: {
        duration: number;
      };
    }

    const scenarios: TestScenarios<TestCase[]> = [
      {
        testName: "sample of timestamps",
        getScenario: () => [
          {
            startTime: 40,
            endTime: 50,
            expected: {
              duration: 10,
            },
          },
          {
            startTime: 42,
            endTime: 256,
            expected: {
              duration: 214,
            },
          },
          {
            startTime: 3,
            endTime: 14,
            expected: {
              duration: 11,
            },
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(`${testName}, duration`, function() {
        for (const { startTime, endTime, expected } of getScenario()) {
          getNow.resetHistory();
          getNow.onFirstCall().returns(startTime);
          getNow.onSecondCall().returns(endTime);

          const { duration } = measureOneRun(benchmarkCallback);
          expect(duration).to.equal(expected.duration);
        }
      });
    }

    test("call the benchmark callback", function() {
      measureOneRun(benchmarkCallback);
      expect(benchmarkCallback).to.have.callCount(1);
    });

    test("use the provided getNow function", function() {
      measureOneRun(benchmarkCallback);
      expect(getNow).to.have.callCount(2);
    });
  });
});
