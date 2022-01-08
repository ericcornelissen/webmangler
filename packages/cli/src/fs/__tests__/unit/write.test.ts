import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import WebManglerCliFileMock from "../../__mocks__/file.mock";

import {
  createWriteFiles,
} from "../../write";

chaiUse(sinonChai);

suite("Writing", function() {
  let writeFiles: ReturnType<typeof createWriteFiles>;

  let fs: {
    readonly writeFile: SinonStub;
  };

  suiteSetup(function() {
    fs = {
      writeFile: sinon.stub(),
    };

    writeFiles = createWriteFiles(fs);
  });

  setup(function() {
    fs.writeFile.resetHistory();
  });

  suite("::writeFiles", function() {
    test("no input files", async function() {
      await writeFiles([]);
      expect(fs.writeFile).not.to.have.been.called;
    });

    test("one input file", async function() {
      const file = new WebManglerCliFileMock({ path: "foo", content: "bar" });

      await writeFiles([file]);
      expect(fs.writeFile).to.have.callCount(1);
      expect(fs.writeFile).to.have.been.calledWith(
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
      expect(fs.writeFile).to.have.callCount(files.length);
      for (const file of files) {
        expect(fs.writeFile).to.have.been.calledWith(
          file.path,
          file.content,
        );
      }
    });
  });
});
