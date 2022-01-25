import type { TestScenarios } from "@webmangler/testing";
import type { SinonStub } from "sinon";

import type { Filters } from "../../types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import {
  createReadFile,
  createReadFilesFiltered,
} from "../../read";

chaiUse(sinonChai);

suite("Reading", function() {
  suite("::readFile", function() {
    let readFile: ReturnType<typeof createReadFile>;

    let fs: {
      readonly readFile: SinonStub;
    };

    suiteSetup(function() {
      fs = {
        readFile: sinon.stub(),
      };

      readFile = createReadFile(fs);
    });

    setup(function() {
      fs.readFile.resetHistory();
    });

    test("file exists", async function() {
      const filePath = "greetings.txt";
      const content = "Hello world!";

      fs.readFile.resolves({ toString: () => content });

      const result = await readFile(filePath);
      expect(result.path).to.equal(filePath);
      expect(result.content).to.equal(content);
      expect(fs.readFile).to.have.callCount(1);
      expect(fs.readFile).to.have.been.calledWith(filePath);
    });

    test("file does not exists", async function() {
      const filePath = "foo.bar";

      fs.readFile.rejects();

      try {
        const result = await readFile(filePath);
        expect(result).to.be.undefined;
      } catch (_) {
        expect(fs.readFile).to.have.callCount(1);
        expect(fs.readFile).to.have.been.calledWith(filePath);
      }
    });
  });

  suite("::readFilesFiltered", function() {
    let readFilesFiltered: ReturnType<typeof createReadFilesFiltered>;

    let listFiles: SinonStub;
    let readFile: SinonStub;

    suiteSetup(function() {
      listFiles = sinon.stub();
      readFile = sinon.stub();

      readFilesFiltered = createReadFilesFiltered(readFile, listFiles);
    });

    setup(function() {
      listFiles.resetHistory();
      readFile.resetHistory();
    });

    interface TestCase {
      readonly basePaths: string[];
      readonly filters: Filters;
      readonly listedFiles?: string[];
    }

    const scenarios: TestScenarios<TestCase[]> = [
      {
        testName: "no base paths",
        getScenario: () => [
          {
            basePaths: [],
            filters: {},
          },
          {
            basePaths: [],
            filters: { extensions: ["js", "ts"] },
          },
        ],
      },
      {
        testName: "one base path",
        getScenario: () => [
          {
            basePaths: ["folder"],
            filters: {},
            listedFiles: ["praise.css", "the.html", "sun.js"],
          },
          {
            basePaths: ["foo"],
            filters: { extensions: ["js", "ts"] },
            listedFiles: ["bar.js", "baz.ts"],
          },
          {
            basePaths: ["foo.bar"],
            filters: { extensions: ["bar"] },
            listedFiles: ["foo.bar"],
          },
          {
            basePaths: ["folder"],
            filters: { extensions: ["php"] },
            listedFiles: [],
          },
        ],
      },
      {
        testName: "multiple base paths",
        getScenario: () => [
          {
            basePaths: ["dark", "souls"],
            filters: {},
            listedFiles: ["praise.css", "the.html", "sun.js"],
          },
          {
            basePaths: ["foo", "bar"],
            filters: { extensions: ["js", "ts"] },
            listedFiles: ["bar.js", "foo.ts"],
          },
          {
            basePaths: ["foo", "foo.sass"],
            filters: { extensions: ["css", "less", "sass"] },
            listedFiles: ["bar.css", "baz.less", "foo.sass"],
          },
          {
            basePaths: ["foo", "bar"],
            filters: { extensions: ["php"] },
            listedFiles: [],
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, async function() {
        for (const testCase of getScenario()) {
          const {
            basePaths,
            filters,
            listedFiles = [],
          } = testCase;

          listFiles.returns(listedFiles);

          const result = await readFilesFiltered(basePaths, filters);
          expect(result).to.have.lengthOf(listedFiles.length);

          expect(listFiles).to.have.callCount(1);
          expect(listFiles).to.have.been.calledWith(
            basePaths,
            filters,
          );

          expect(readFile).to.have.callCount(listedFiles.length);
          for (const listedFile of listedFiles) {
            expect(readFile).to.have.been.calledWith(listedFile);
          }

          listFiles.resetHistory();
          readFile.resetHistory();
        }
      });
    }
  });
});
