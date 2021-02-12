import { expect, use as chaiUse } from "chai";
import * as fs from "fs";
import * as path from "path";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as fsMock from "../__mocks__/fs.mock";

import { readFilesInAll } from "../read";

chaiUse(sinonChai);

suite("Reading", function() {
  suiteSetup(function() {
    sinon.stub(fs, "existsSync").callsFake(fsMock.existsSync);
    sinon.stub(fs, "lstatSync").callsFake(fsMock.lstatSync);
    sinon.stub(fs, "readdirSync").callsFake(fsMock.readdirSync);
    sinon.stub(fs, "readFileSync").callsFake(fsMock.readFileSync);
  });

  setup(function() {
    fsMock.existsSync.resetHistory();
    fsMock.lstatSync.resetHistory();
    fsMock.readdirSync.resetHistory();
    fsMock.readFileSync.resetHistory();
  });

  suite("::readFiles", function() {
    test("no input file paths", function() {
      const result = readFilesInAll([], []);
      expect(result).to.have.lengthOf(0);
    });

    test("one input file that does not exist", function() {
      fsMock.existsSync.returns(false);

      const extension = "bar";
      const file = `foo.${extension}`;

      const result = readFilesInAll([file], [extension]);
      expect(result).to.have.length(0);
      expect(fsMock.existsSync).to.have.callCount(1);
      expect(fsMock.readdirSync).not.to.have.been.called;
      expect(fsMock.readFileSync).not.to.have.been.called;
    });

    test("one input file that exists", function() {
      fsMock.existsSync.returns(true);
      fsMock.lstatSync.returns({ isFile: () => true });
      fsMock.readFileSync.returns({ toString: () => "" });

      const extension = "bar";
      const file = `foo.${extension}`;

      const result = readFilesInAll([file], [extension]);
      expect(result).to.have.length(1);
      expect(fsMock.existsSync).to.have.callCount(1);
      expect(fsMock.lstatSync).to.have.callCount(1);
      expect(fsMock.readFileSync).to.have.callCount(1);
      expect(fsMock.readdirSync).not.to.have.been.called;
    });

    test("one input file that exists but is filtered", function() {
      fsMock.existsSync.returns(true);
      fsMock.lstatSync.returns({ isFile: () => true });
      fsMock.readFileSync.returns({ toString: () => "" });

      const extension = "bar";
      const file = `foo.${extension}-x`;

      const result = readFilesInAll([file], [extension]);
      expect(result).to.have.length(0);
      expect(fsMock.existsSync).to.have.callCount(1);
      expect(fsMock.readdirSync).not.to.have.been.called;
      expect(fsMock.readFileSync).not.to.have.been.called;
    });

    test("multiple input file that exist", function() {
      fsMock.existsSync.returns(true);
      fsMock.lstatSync.returns({ isFile: () => true });

      const extension = "txt";
      const paths = [`foo.${extension}`, `bar.${extension}`];

      const result = readFilesInAll(paths, [extension]);
      expect(result).to.have.length(paths.length);
      expect(fsMock.existsSync).to.have.callCount(paths.length);
      expect(fsMock.lstatSync).to.have.callCount(paths.length);
      expect(fsMock.readFileSync).to.have.callCount(paths.length);
      expect(fsMock.readdirSync).not.to.have.been.called;
    });

    test("multiple input file that exist but are filtered", function() {
      fsMock.existsSync.returns(true);
      fsMock.lstatSync.returns({ isFile: () => true });

      const extension = ".txt";
      const paths = [`foo.${extension}-x`, `bar.${extension}-x`];

      const result = readFilesInAll(paths, [extension]);
      expect(result).to.have.length(0);
      expect(fsMock.existsSync).to.have.callCount(paths.length);
      expect(fsMock.lstatSync).to.have.callCount(paths.length);
      expect(fsMock.readFileSync).not.to.have.been.called;
      expect(fsMock.readdirSync).not.to.have.been.called;
    });

    test("multiple input file that exist but some are filtered", function() {
      fsMock.existsSync.returns(true);
      fsMock.lstatSync.returns({ isFile: () => true });

      const extension = "txt";
      const paths = [
        `praise.${extension}-x`,
        `the.${extension}`,
        `sun.${extension}-x`,
      ];

      const result = readFilesInAll(paths, [extension]);
      expect(result).to.have.length(1);
      expect(fsMock.existsSync).to.have.callCount(paths.length);
      expect(fsMock.lstatSync).to.have.callCount(paths.length);
      expect(fsMock.readFileSync).to.have.callCount(1);
      expect(fsMock.readdirSync).not.to.have.been.called;
    });

    test("input is directory with files", function() {
      const extension = "txt";
      const directory = path.resolve("foobar");
      const files = [
        `praise.${extension}`,
        `the.${extension}`,
        `sun.${extension}`,
      ];

      fsMock.existsSync.returns(true);
      fsMock.readdirSync.returns(files);
      fsMock.lstatSync.callsFake((path) => {
        if (path === directory) {
          return { isFile: () => false };
        }

        return { isFile: () => true };
      });

      const result = readFilesInAll([directory], [extension]);
      expect(result).to.have.length(files.length);
      expect(fsMock.existsSync).to.have.callCount(1 + files.length);
      expect(fsMock.lstatSync).to.have.callCount(1 + files.length);
      expect(fsMock.readFileSync).to.have.callCount(files.length);
      expect(fsMock.readdirSync).to.have.callCount(1);
    });

    test("input is directory with files but some are filtered", function() {
      const extension = "txt";
      const directory = path.resolve("foobar");
      const files = [
        `praise.${extension}`,
        `the.${extension}-x`,
        `sun.${extension}`,
      ];

      fsMock.existsSync.returns(true);
      fsMock.readdirSync.returns(files);
      fsMock.lstatSync.callsFake((path) => {
        if (path === directory) {
          return { isFile: () => false };
        }

        return { isFile: () => true };
      });

      const result = readFilesInAll([directory], [extension]);
      expect(result).to.have.length(files.length - 1);
      expect(fsMock.existsSync).to.have.callCount(1 + files.length);
      expect(fsMock.lstatSync).to.have.callCount(1 + files.length);
      expect(fsMock.readFileSync).to.have.callCount(files.length - 1);
      expect(fsMock.readdirSync).to.have.callCount(1);
    });

    test("input has nested directories and files", function() {
      const extension = "txt";
      const level0Dir = path.resolve("foo");
      const level1Dir = path.resolve("bar");
      const level1Files = [
        level1Dir,
        `praise.${extension}`,
        `the.${extension}`,
        `sun.${extension}`,
      ];
      const level2Files = [
        `hello.${extension}`,
        `world.${extension}`,
      ];

      const dirsCount = 2;
      const filesCount = level1Files.length - 1 + level2Files.length;

      fsMock.existsSync.returns(true);
      fsMock.readdirSync.callsFake((path) => {
        if (path === level0Dir) {
          return level1Files;
        } else if (path === level1Dir) {
          return level2Files;
        }
      });
      fsMock.lstatSync.callsFake((path) => {
        if ([level0Dir, level1Dir].includes(path)) {
          return { isFile: () => false };
        }

        return { isFile: () => true };
      });

      const result = readFilesInAll([level0Dir], [extension]);
      expect(result).to.have.length(filesCount);
      expect(fsMock.existsSync).to.have.callCount(dirsCount + filesCount);
      expect(fsMock.lstatSync).to.have.callCount(dirsCount + filesCount);
      expect(fsMock.readFileSync).to.have.callCount(filesCount);
      expect(fsMock.readdirSync).to.have.callCount(dirsCount);
    });
  });
});
