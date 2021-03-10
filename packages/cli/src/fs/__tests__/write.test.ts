import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as fs from "fs";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as fsMock from "../__mocks__/fs.mock";
import WebManglerCliFileMock from "../__mocks__/file.mock";

import { writeFiles } from "../write";

chaiUse(sinonChai);

suite("Writing", function() {
  let fsWriteFileSync: SinonStub;

  suiteSetup(function() {
    fsWriteFileSync = sinon.stub(fs, "writeFileSync").callsFake(fsMock.writeFileSync);
  });

  setup(function() {
    fsMock.writeFileSync.resetHistory();
  });

  suite("::writeFiles", function() {
    test("no input files", function() {
      writeFiles([]);
      expect(fsMock.writeFileSync).not.to.have.been.called;
    });

    test("one input file", function() {
      const file = new WebManglerCliFileMock({ path: "foo", content: "bar" });
      writeFiles([file]);
      expect(fsMock.writeFileSync).to.have.callCount(1);
      expect(fsMock.writeFileSync).to.have.been.calledWith(file.path, file.content);
    });

    test("multiple input files", function() {
      const files = [
        new WebManglerCliFileMock({ path: "foo.txt", content: "bar" }),
        new WebManglerCliFileMock({ path: "hello.md", content: "world" }),
      ];

      writeFiles(files);
      expect(fsMock.writeFileSync).to.have.callCount(files.length);
      for (const file of files) {
        expect(fsMock.writeFileSync).to.have.been.calledWith(file.path, file.content);
      }
    });
  });

  suiteTeardown(function() {
    fsWriteFileSync.restore();
  });
});
