import type { Filters } from "../../types";

import * as os from "node:os";
import * as path from "node:path";

import { expect } from "chai";

import {
  readFilesFiltered,
} from "../../index";

suite("Reading", function() {
  suite("::readFilesFiltered", function() {
    let tmpDir: string;
    let testdataDir: string;

    suiteSetup(function() {
      tmpDir = os.tmpdir();
      testdataDir = path.resolve(".", "testdata");
    });

    test("no base paths, without filters", async function() {
      const basePaths: string[] = [];
      const filters: Filters = { };

      try {
        await readFilesFiltered(basePaths, filters);
      } catch (error) {
        expect.fail(`${error}`);
      }
    });

    test("some base paths, without filters", async function() {
      const basePaths: string[] = [testdataDir, tmpDir];
      const filters: Filters = { };

      try {
        await readFilesFiltered(basePaths, filters);
      } catch (error) {
        expect.fail(`${error}`);
      }
    });

    test("some base paths, with filters", async function() {
      const basePaths: string[] = [testdataDir, tmpDir];
      const filters: Filters = {
        extensions: ["css", "html", "js"],
      };

      try {
        await readFilesFiltered(basePaths, filters);
      } catch (error) {
        expect.fail(`${error}`);
      }
    });
  });
});
