import type { TestScenario } from "@webmangler/testing";
import type { SinonStub } from "sinon";
import type { Filters } from "../types";

import { expect, use as chaiUse } from "chai";
import * as fs from "fs";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as list from "../list";
import { readFile, readFilesFiltered } from "../read";

chaiUse(sinonChai);

suite("Reading", function() {
  let fsReadFileStub: SinonStub;
  let listFilesFilteredStub: SinonStub;

  suiteSetup(function() {
    fsReadFileStub = sinon.stub(fs.promises, "readFile");

    listFilesFilteredStub = sinon.stub(list, "listFilesFiltered");
  });

  setup(function() {
    fsReadFileStub.resolves({ toString: () => "" });
    fsReadFileStub.resetHistory();

    listFilesFilteredStub.returns([]);
    listFilesFilteredStub.resetHistory();
  });

  suite("::readFile", function() {
    test("file exists", async function() {
      const filePath = "greetings.txt";
      const content = "Hello world!";

      fsReadFileStub.resolves({ toString: () => content });

      const result = await readFile(filePath);
      expect(result.path).to.equal(filePath);
      expect(result.content).to.equal(content);
      expect(fsReadFileStub).to.have.callCount(1);
      expect(fsReadFileStub).to.have.been.calledWith(filePath);
    });

    test("file does not exists", async function() {
      const filePath = "foo.bar";

      fsReadFileStub.rejects();

      try {
        const result = await readFile(filePath);
        expect(result).to.be.undefined;
      } catch (_) {
        expect(fsReadFileStub).to.have.callCount(1);
        expect(fsReadFileStub).to.have.been.calledWith(filePath);
      }
    });
  });

  suite("::readFilesFiltered", function() {
    type TestCase = {
      readonly basePaths: string[];
      readonly filters: Filters;
      readonly listedFiles?: string[];
    }

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "no base paths",
        cases: [
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
        name: "one base path",
        cases: [
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
        name: "multiple base paths",
        cases: [
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

    for (const { name, cases } of scenarios) {
      test(name, async function() {
        for (const testCase of cases) {
          const {
            basePaths,
            filters,
            listedFiles = [],
          } = testCase;

          listFilesFilteredStub.returns(listedFiles);

          const result = await readFilesFiltered(basePaths, filters);
          expect(result).to.have.lengthOf(listedFiles.length);

          expect(listFilesFilteredStub).to.have.callCount(1);
          expect(listFilesFilteredStub).to.have.been.calledWith(
            basePaths,
            filters,
          );

          expect(fsReadFileStub).to.have.callCount(listedFiles.length);
          for (const listedFile of listedFiles) {
            expect(fsReadFileStub).to.have.been.calledWith(listedFile);
          }

          listFilesFilteredStub.resetHistory();
          fsReadFileStub.resetHistory();
        }
      });
    }
  });

  suiteTeardown(function() {
    fsReadFileStub.restore();

    listFilesFilteredStub.restore();
  });
});
