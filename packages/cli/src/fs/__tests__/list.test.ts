import type { TestScenario } from "@webmangler/testing";
import type { SinonStub } from "sinon";
import type { Filters } from "../types";

import { expect, use as chaiUse } from "chai";
import * as fs from "fs";
import * as path from "path";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { listFilesFiltered } from "../list";

chaiUse(sinonChai);

suite("Listing", function() {
  let fsExistsSyncStub: SinonStub;
  let fsLstatSyncStub: SinonStub;
  let fsReaddirSyncStub: SinonStub;

  suiteSetup(function() {
    fsExistsSyncStub = sinon.stub(fs, "existsSync");
    fsLstatSyncStub = sinon.stub(fs, "lstatSync");
    fsReaddirSyncStub = sinon.stub(fs, "readdirSync");

    const resolveStub = sinon.stub(path, "resolve");
    resolveStub.callsFake((...segments) => segments.join("/"));
  });

  setup(function() {
    fsExistsSyncStub.resetHistory();
    fsLstatSyncStub.resetHistory();
    fsReaddirSyncStub.resetHistory();
  });

  suite("::listFilesFiltered", function() {
    type TestCase = {
      basePaths: string[];
      expected?: string[];
      throws?: boolean;
      filters?: Filters;
      notExistsSet?: Set<string>;
      lstatMap?: Map<string, "file" | "folder">;
      readdirMap?: Map<string, string[]>;
    };

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "no base paths",
        cases: [
          {
            basePaths: [],
            expected: [],
          },
          {
            basePaths: [],
            expected: [],
            filters: { extensions: [] },
          },
          {
            basePaths: [],
            expected: [],
            filters: { extensions: ["foo", "bar"] },
          },
        ],
      },
      {
        name: "one base path",
        cases: [
          {
            basePaths: ["foo.bar"],
            expected: ["foo.bar"],
            lstatMap: new Map([
              ["foo.bar", "file"],
            ]),
          },
          {
            basePaths: ["foo"],
            expected: ["foo/bar.js", "foo/baz.css"],
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
            basePaths: ["foo"],
            expected: ["foo/bar/file.js", "foo/baz.css"],
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
            basePaths: ["foo"],
            expected: ["foo/bar/file.js", "foo/baz.js"],
            filters: { extensions: ["js"] },
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
        name: "multiple base path",
        cases: [
          {
            basePaths: ["foo", "bar"],
            expected: ["foo", "bar"],
            lstatMap: new Map([
              ["foo", "file"],
              ["bar", "file"],
            ]),
          },
          {
            basePaths: ["foo", "bar.css"],
            expected: ["foo/bar.js", "bar.css"],
            lstatMap: new Map([
              ["foo", "folder"],
              ["foo/bar.js", "file"],
              ["bar.css", "file"],
            ]),
            readdirMap: new Map([
              ["foo", ["bar.js"]],
            ]),
          },
          {
            basePaths: ["foo", "hello"],
            expected: ["foo/bar.ts", "hello/world.css"],
            lstatMap: new Map([
              ["foo", "folder"],
              ["foo/bar.ts", "file"],
              ["hello", "folder"],
              ["hello/world.css", "file"],
            ]),
            readdirMap: new Map([
              ["foo", ["bar.ts"]],
              ["hello", ["world.css"]],
            ]),
          },
          {
            basePaths: ["foo", "hello"],
            expected: ["foo/bar.css", "foo/bar.html", "hello/world.css"],
            filters: { extensions: ["css", "html", "js"] },
            lstatMap: new Map([
              ["foo", "folder"],
              ["foo/bar.css", "file"],
              ["foo/bar.html", "file"],
              ["foo/bar.ts", "file"],
              ["hello", "folder"],
              ["hello/world.css", "file"],
              ["hello/world.pug", "file"],
              ["hello/world.ts", "file"],
            ]),
            readdirMap: new Map([
              ["foo", ["bar.css", "bar.html", "bar.ts"]],
              ["hello", ["world.css", "world.pug", "world.ts"]],
            ]),
          },
        ],
      },
      {
        name: "missing files or folders",
        cases: [
          {
            basePaths: ["foo.bar"],
            throws: true,
            notExistsSet: new Set(["foo.bar"]),
          },
          {
            basePaths: ["foo"],
            throws: true,
            notExistsSet: new Set(["foo/bar.txt"]),
            lstatMap: new Map([
              ["foo", "folder"],
            ]),
            readdirMap: new Map([
              ["foo", ["bar.txt"]],
            ]),
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            basePaths,
            expected = [],
            throws,
            filters = {},
            notExistsSet = new Set(),
            lstatMap = new Map(),
            readdirMap = new Map(),
          } = testCase;

          fsExistsSyncStub.callsFake((filePath) => !notExistsSet.has(filePath));
          fsLstatSyncStub.callsFake((filePath) => {
            const lstat = lstatMap.get(filePath);
            return {
              isDirectory: () => lstat === "folder",
              isFile: () => lstat === "file",
            };
          });
          fsReaddirSyncStub.callsFake((folderPath) => {
            const folderEntries = readdirMap.get(folderPath);
            return folderEntries || [];
          });

          let files: string[] = [];
          const call = expect(() => {
            const g = listFilesFiltered(basePaths, filters);
            files = Array.from(g);
          });

          if (throws) {
            call.to.throw();
          } else {
            call.not.to.throw();
          }

          expect(files).to.have.lengthOf(expected.length);
          for (const result of files) {
            expect(expected).to.include(result);
          }
        }
      });
    }
  });

  suiteTeardown(function() {
    fsExistsSyncStub.restore();
    fsLstatSyncStub.restore();
    fsReaddirSyncStub.restore();
  });
});
