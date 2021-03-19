import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import { promises as fs } from "fs";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import WebManglerCliFileMock from "../__mocks__/file.mock";

import { writeFiles } from "../write";

chaiUse(sinonChai);

suite("Writing", function() {
  let fsWriteFileStub: SinonStub;

  suiteSetup(function() {
    fsWriteFileStub = sinon.stub(fs, "writeFile");
  });

  setup(function() {
    fsWriteFileStub.resetHistory();
  });

  suite("::writeFiles", function() {
    test("no input files", async function() {
      await writeFiles([]);
      expect(fsWriteFileStub).not.to.have.been.called;
    });

    test("one input file", async function() {
      const file = new WebManglerCliFileMock({ path: "foo", content: "bar" });

      await writeFiles([file]);
      expect(fsWriteFileStub).to.have.callCount(1);
      expect(fsWriteFileStub).to.have.been.calledWith(
        file.path,
        file.content,
      );
    });

    test("multiple input files", async function() {
      const files = [
        new WebManglerCliFileMock({ path: "foo.txt", content: "bar" }),
        new WebManglerCliFileMock({ path: "hello.md", content: "world" }),
      ];

      await writeFiles(files);
      expect(fsWriteFileStub).to.have.callCount(files.length);
      for (const file of files) {
        expect(fsWriteFileStub).to.have.been.calledWith(
          file.path,
          file.content,
        );
      }
    });
  });

  suiteTeardown(function() {
    fsWriteFileStub.restore();
  });
});
