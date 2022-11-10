import type { TestScenarios } from "@webmangler/testing";
import type { SinonStub } from "sinon";

import type { Filters } from "../../types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import {
  createListFiles,
  createListFilesFiltered,
} from "../../list";

chaiUse(sinonChai);

suite("Listing", function() {
  suite("::listFiles", function() {
    let listFiles: ReturnType<typeof createListFiles>;

    let fs: {
      readonly access: SinonStub;
      readonly lstat: SinonStub;
      readonly readdir: SinonStub;
    };
    let path: {
      readonly resolve: SinonStub;
    };

    suiteSetup(function() {
      fs = {
        access: sinon.stub(),
        lstat: sinon.stub(),
        readdir: sinon.stub(),
      };
      path = {
        resolve: sinon.stub().callsFake((...segments) => segments.join("/")),
      };

      listFiles = createListFiles(fs, path);
    });

    interface TestCase {
      readonly basePath: string;
      readonly expectedFiles: string[];
      readonly lstatMap: Map<string, "file" | "folder">;
      readonly readdirMap: Map<string, string[]>;
    }

    const scenarios: TestScenarios<TestCase[]> = [
      {
        testName: "one base path",
        getScenario: () => [
          {
            basePath: "foo.bar",
            expectedFiles: ["foo.bar"],
            expectThrows: false,
            lstatMap: new Map([
              ["foo.bar", "file"],
            ]),
            readdirMap: new Map(),
          },
          {
            basePath: "foo",
            expectedFiles: [
              "foo/bar.js",
              "foo/baz.css",
            ],
            expectThrows: false,
            lstatMap: new Map([
              ["foo", "folder"],
              ["foo/bar.js", "file"],
              ["foo/baz.css", "file"],
            ]),
            readdirMap: new Map([
              ["foo", ["bar.js", "baz.css"]],
            ]),
          },
          {
            basePath: "foo",
            expectedFiles: [
              "foo/bar/file.js",
              "foo/baz.css",
            ],
            expectThrows: false,
            lstatMap: new Map([
              ["foo", "folder"],
              ["foo/bar", "folder"],
              ["foo/bar/file.js", "file"],
              ["foo/baz.css", "file"],
            ]),
            readdirMap: new Map([
              ["foo", ["bar", "baz.css"]],
              ["foo/bar", ["file.js"]],
            ]),
          },
          {
            basePath: "foo",
            expectedFiles: [
              "foo/bar/file.css",
              "foo/bar/file.js",
              "foo/bar.html",
              "foo/baz.css",
              "foo/baz.js",
            ],
            expectThrows: false,
            lstatMap: new Map([
              ["foo", "folder"],
              ["foo/bar", "folder"],
              ["foo/bar/file.js", "file"],
              ["foo/bar/file.css", "file"],
              ["foo/bar.html", "file"],
              ["foo/baz.css", "file"],
              ["foo/baz.js", "file"],
            ]),
            readdirMap: new Map([
              ["foo", ["bar", "bar.html", "baz.css", "baz.js"]],
              ["foo/bar", ["file.js", "file.css"]],
            ]),
          },
        ],
      },
      {
        testName: "file missing",
        getScenario: () => [
          {
            basePath: "foo",
            expectedFiles: ["foo/bar"],
            expectThrows: false,
            lstatMap: new Map([
              ["foo", "folder"],
              ["foo/bar", "file"],
            ]),
            readdirMap: new Map([
              ["foo", ["bar", "baz"]],
            ]),
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, async function() {
        for (const testCase of getScenario()) {
          const {
            basePath,
            expectedFiles,
            lstatMap,
            readdirMap,
          } = testCase;

          fs.access.callsFake((filePath) => {
            if (!lstatMap.has(filePath)) {
              throw new Error(`No file at ${filePath}`);
            }
          });
          fs.lstat.callsFake((filePath) => {
            const lstat = lstatMap.get(filePath);
            return {
              isFile: () => lstat === "file",
            };
          });
          fs.readdir.callsFake((folderPath) => {
            const folderEntries = readdirMap.get(folderPath) || [];
            return folderEntries;
          });

          let fileCount = 0;
          for await (const result of listFiles(basePath)) {
            expect(expectedFiles).to.include(result);
            fileCount += 1;
          }

          expect(fileCount).to.equal(expectedFiles.length);
        }
      });
    }
  });

  suite("::listFilesFiltered", function() {
    let listFilesFiltered: ReturnType<typeof createListFilesFiltered>;

    let listFiles: SinonStub;

    suiteSetup(function() {
      listFiles = sinon.stub();

      listFilesFiltered = createListFilesFiltered(listFiles);
    });

    setup(function() {
      listFiles.reset();
    });

    interface TestCase {
      readonly basePaths: string[];
      readonly expectedFiles: string[];
      readonly filters: Filters;
      readonly lists: Map<string, Iterable<string>>;
    }

    const scenarios: TestScenarios<TestCase[]> = [
      {
        testName: "no base paths",
        getScenario: () => [
          {
            basePaths: [],
            expectedFiles: [],
            filters: { },
            lists: new Map(),
          },
          {
            basePaths: [],
            expectedFiles: [],
            filters: { extensions: [] },
            lists: new Map(),
          },
          {
            basePaths: [],
            expectedFiles: [],
            filters: { extensions: ["foo", "bar"] },
            lists: new Map(),
          },
        ],
      },
      {
        testName: "one base path",
        getScenario: () => [
          {
            basePaths: ["foo.bar"],
            expectedFiles: ["foo.bar"],
            filters: { },
            lists: new Map([
              ["foo.bar", ["foo.bar"]],
            ]),
          },
          {
            basePaths: ["foo"],
            expectedFiles: ["foo/bar.js", "foo/baz.css"],
            filters: { },
            lists: new Map([
              ["foo", ["foo/bar.js", "foo/baz.css"]],
            ]),
          },
          {
            basePaths: ["foo"],
            expectedFiles: ["foo/baz.css"],
            filters: { extensions: ["css"] },
            lists: new Map([
              ["foo", ["foo/bar.js", "foo/baz.css"]],
            ]),
          },
          {
            basePaths: ["foo"],
            expectedFiles: ["foo/bar.js", "foo/baz.css"],
            filters: { extensions: ["css", "js"] },
            lists: new Map([
              ["foo", ["foo/bar.js", "foo/baz.css"]],
            ]),
          },
        ],
      },
      {
        testName: "multiple base paths",
        getScenario: () => [
          {
            basePaths: ["foo.js", "bar.css"],
            expectedFiles: ["foo.js", "bar.css"],
            filters: { },
            lists: new Map([
              ["foo.js", ["foo.js"]],
              ["bar.css", ["bar.css"]],
            ]),
          },
          {
            basePaths: ["foo", "bar.css"],
            expectedFiles: ["foo/bar.js", "bar.css"],
            filters: { },
            lists: new Map([
              ["foo", ["foo/bar.js"]],
              ["bar.css", ["bar.css"]],
            ]),
          },
          {
            basePaths: ["foo", "hello"],
            expectedFiles: ["foo/bar.ts", "hello/world.css"],
            filters: { },
            lists: new Map([
              ["foo", ["foo/bar.ts"]],
              ["hello", ["hello/world.css"]],
            ]),
          },
          {
            basePaths: ["foo", "hello"],
            expectedFiles: ["foo/bar.ts"],
            filters: { extensions: ["ts"] },
            lists: new Map([
              ["foo", ["foo/bar.ts"]],
              ["hello", ["hello/world.css"]],
            ]),
          },
          {
            basePaths: ["foo", "hello"],
            expectedFiles: ["hello/world.css"],
            filters: { extensions: ["css"] },
            lists: new Map([
              ["foo", ["foo/bar.ts"]],
              ["hello", ["hello/world.css"]],
            ]),
          },
          {
            basePaths: ["foo", "hello"],
            expectedFiles: ["foo/bar.ts", "hello/world.css"],
            filters: { extensions: ["css", "ts"] },
            lists: new Map([
              ["foo", ["foo/bar.ts"]],
              ["hello", ["hello/world.css"]],
            ]),
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, async function() {
        for (const testCase of getScenario()) {
          const {
            basePaths,
            expectedFiles,
            filters,
            lists,
          } = testCase;

          listFiles.callsFake((basePath) => {
            const files = lists.get(basePath) || [];
            return files;
          });

          let fileCount = 0;
          for await (const result of listFilesFiltered(basePaths, filters)) {
            expect(expectedFiles).to.include(result);
            fileCount += 1;
          }

          expect(fileCount).to.equal(expectedFiles.length);
        }
      });
    }
  });
});
