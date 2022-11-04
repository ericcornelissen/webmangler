import type { WebManglerCliFile } from "../../types";

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import { expect } from "chai";

import {
  writeFiles,
} from "../../index";

suite("Writing", function() {
  suite("::writeFiles", function() {
    let tmpdir: string;

    suiteSetup(function() {
      tmpdir = os.tmpdir();
    });

    test("no input files", async function() {
      const files: Iterable<WebManglerCliFile> = [];

      try {
        await writeFiles(files);
      } catch (error) {
        expect.fail(`${error}`);
      }
    });

    test("some input files", async function() {
      const fileA: WebManglerCliFile = {
        content: "foobar",
        originalSize: 0,
        path: path.resolve(tmpdir, "webmangler-cli-a.test"),
        size: 0,
        type: "txt",
      };

      const files: Iterable<WebManglerCliFile> = [
        fileA,
      ];

      try {
        await writeFiles(files);

        for (const file of files) {
          const fileExists = fs.existsSync(file.path);
          expect(fileExists).to.be.true;
        }
      } catch (error) {
        expect.fail(`${error}`);
      }
    });
  });
});
