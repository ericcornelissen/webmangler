import { expect } from "chai";
import * as sinon from "sinon";

import {
  buildCommonDir,
} from "../../paths";

suite("Paths for Stats", function() {
  suite("::commonDir", function() {
    let commonDir: ReturnType<typeof buildCommonDir>;

    const fileSystemRoot = "/";
    const pathSeparator = "/";

    const projectRoot = fileSystemRoot + [
      "full",
      "path",
      "to",
      "a",
      "repository",
    ].join(pathSeparator);

    const _files = new Set<string>();
    const dirAt = (...relativePath: readonly string[]) => {
      const fullDirPath = [
        projectRoot,
        ...relativePath.filter((entry) => entry !== "."),
      ].join(pathSeparator);

      return fullDirPath;
    };
    const fileAt = (...relativePath: readonly string[]) => {
      return {
        named: (fileName: string): string => {
          const fullFilePath = [
            projectRoot,
            ...relativePath.filter((entry) => entry !== "."),
            fileName,
          ].join(pathSeparator);

          _files.add(fullFilePath);
          return fullFilePath;
        },
      };
    };

    suiteSetup(function() {
      const isFile = (path: string): boolean => {
        return _files.has(path);
      };

      const dirname = sinon.stub();
      dirname.callsFake((path: string): string => {
        const expr = new RegExp(
          `${pathSeparator}[^${pathSeparator}]+$`,
        );
        return path.replace(expr, "");
      });

      const lstat = sinon.stub();
      const dirStats = {
        isFile: () => false,
      };
      const fileStats = {
        isFile: () => true,
      };
      lstat.callsFake((path: string) => {
        if (isFile(path)) {
          return fileStats;
        } else {
          return dirStats;
        }
      });

      commonDir = buildCommonDir({
        dirname,
        lstat,
        pathSeparator,
      });
    });

    test("both in the project root", function() {
      const cases = [
        {
          pathA: dirAt("."),
          pathB: dirAt("."),
        },
        {
          pathA: dirAt("."),
          pathB: fileAt(".").named("a"),
        },
        {
          pathA: fileAt(".").named("a"),
          pathB: dirAt("."),
        },
        {
          pathA: fileAt(".").named("a"),
          pathB: fileAt(".").named("b"),
        },
      ];

      for (const { pathA, pathB } of cases) {
        const result = commonDir(pathA, pathB);
        expect(result).to.equal(projectRoot);
      }
    });

    test("one in project root and one nested", function() {
      const cases = [
        {
          pathA: dirAt("."),
          pathB: dirAt("a", "b"),
        },
        {
          pathA: dirAt("."),
          pathB: fileAt("a", "b").named("c"),
        },
        {
          pathA: fileAt(".").named("a"),
          pathB: dirAt("a", "b"),
        },
        {
          pathA: fileAt(".").named("a"),
          pathB: fileAt("a", "b").named("c"),
        },
      ];

      for (const { pathA, pathB } of cases) {
        const result = commonDir(pathA, pathB);
        expect(result).to.equal(projectRoot);
      }
    });

    test("one nested and one in project root", function() {
      const cases = [
        {
          pathA: dirAt("a", "b"),
          pathB: dirAt("."),
        },
        {
          pathA: dirAt("a", "b"),
          pathB: fileAt(".").named("a"),
        },
        {
          pathA: fileAt("a", "b").named("c"),
          pathB: dirAt("."),
        },
        {
          pathA: fileAt("a", "b").named("c"),
          pathB: fileAt(".").named("a"),
        },
      ];

      for (const { pathA, pathB } of cases) {
        const result = commonDir(pathA, pathB);
        expect(result).to.equal(projectRoot);
      }
    });

    test("both in (different) nested dirs", function() {
      const cases = [
        {
          pathA: dirAt("a", "b"),
          pathB: dirAt("c", "d"),
        },
        {
          pathA: dirAt("a", "b"),
          pathB: fileAt("c", "d").named("e"),
        },
        {
          pathA: fileAt("a", "b").named("c"),
          pathB: dirAt("d", "e"),
        },
        {
          pathA: fileAt("a", "b").named("c"),
          pathB: fileAt("d", "e").named("f"),
        },
      ];

      for (const { pathA, pathB } of cases) {
        const result = commonDir(pathA, pathB);
        expect(result).to.equal(projectRoot);
      }
    });

    test("deeply nested dir name match, not the nested full path", function() {
      const cases = [
        {
          pathA: dirAt("a", "c"),
          pathB: dirAt("b", "c"),
        },
        {
          pathA: dirAt("a", "c"),
          pathB: fileAt("b", "c").named("d"),
        },
        {
          pathA: fileAt("a", "c").named("d"),
          pathB: dirAt("b", "c"),
        },
        {
          pathA: fileAt("a", "c").named("d"),
          pathB: fileAt("b", "c").named("e"),
        },
      ];

      for (const { pathA, pathB } of cases) {
        const result = commonDir(pathA, pathB);
        expect(result).to.equal(projectRoot);
      }
    });

    test("file name matches the name of a nested dir", function() {
      const cases = [
        {
          pathA: dirAt("a", "b"),
          pathB: fileAt(".").named("a"),
        },
        {
          pathA: fileAt(".").named("a"),
          pathB: dirAt("a", "b"),
        },
      ];

      for (const { pathA, pathB } of cases) {
        const result = commonDir(pathA, pathB);
        expect(result).to.equal(projectRoot);
      }
    });

    test("only common directory is the root", function() {
      const result = commonDir(
        "/a/foo/bar",
        "/b/hello/world",
      );
      expect(result).to.equal("/");
    });

    test("no common directory (e.g. 'C:\\' and 'D:\\')", function() {
      expect(() => {
        commonDir(
          "a/foo/bar",
          "b/hello/world",
        );
      }).to.throw();
    });
  });
});
