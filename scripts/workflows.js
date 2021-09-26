import * as fs from "fs";

import * as paths from "./paths.js";

const JOB_NAME_BENCHMARK = "benchmark";
const JOB_NAME_COMPILE = "compile";
const JOB_NAME_TEST = "test";
const JOB_RUNS_ON = "ubuntu-latest";

main();

function main() {
  for (const pkg of paths.getPackages()) {
    const workflow = createWorkflow(pkg);
    const workflowFile = paths.resolve.fromRoot(
      ".github",
      "workflows",
      `package-${pkg}.yml`,
    );
    fs.writeFileSync(workflowFile, workflow);
  }
}

function createWorkflow(pkg) {
  return removeEmptyLines(`# NOTICE:
# THIS WORKFLOW IS GENERATED AND SHOULD NOT BE EDITED MANUALLY.

name: Validate package ${pkg}
on:
  push:
    branches:
      - main
    paths:
      - "packages/${pkg}/**"
  pull_request:
    paths:
      - "packages/${pkg}/**"

jobs:
  ${createBenchmarkJob(pkg)}
  ${createCompileJob(pkg)}
  ${createTestJob(pkg)}
`) + "\n";
}

function createBenchmarkJob(pkg) {
  if (!hasFiles(pkg, /\.bench\.ts$/)) {
    return "";
  }

  return `
  ${JOB_NAME_BENCHMARK}:
    name: Benchmark package ${pkg}
    runs-on: ${JOB_RUNS_ON}
    needs: [${JOB_NAME_TEST}]
    steps:
      ${commonJobSetup(pkg)}
      - name: Run benchmarks for packages/${pkg}
        run: npm run benchmark -- ${pkg}
  `;
}

function createCompileJob(pkg) {
  return `${JOB_NAME_COMPILE}:
    name: Compile package ${pkg}
    runs-on: ${JOB_RUNS_ON}
    steps:
      ${commonJobSetup(pkg)}
      - name: Compile packages/${pkg}
        working-directory: packages/${pkg}
        run: npm run compile
  `;
}

function createTestJob(pkg) {
  if (!hasFiles(pkg, /\.test\.ts$/)) {
    return "";
  }

  return `
  ${JOB_NAME_TEST}:
    name: Test package ${pkg}
    runs-on: ${JOB_RUNS_ON}
    needs: [${JOB_NAME_COMPILE}]
    steps:
      ${commonJobSetup(pkg)}
      - name: Run test suite for packages/${pkg}
        run: npm run coverage -- ${pkg}
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v2
        with:
          file: ./_reports/coverage/lcov.info
          flags: package-${pkg}
  `;
}

function commonJobSetup(pkg) {
  return `
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Use Node.js 15
        uses: actions/setup-node@v2
        with:
          node-version: 15.14.0
          cache: npm
      - name: Install monorepo dependencies
        working-directory: ./
        run: npm ci
      - name: Install packages/${pkg} dependencies
        working-directory: ./packages/${pkg}
        run: npm ci
  `;
}

function hasFiles(pkg, fileRegExp) {
  const helper = function(folder) {
    for (const entry of fs.readdirSync(folder)) {
      const entryPath = paths.resolve._(folder, entry);
      const stats = fs.statSync(entryPath);
      if (!stats.isFile()) {
        const result = helper(entryPath);
        if (result) return result;
      } else {
        const result = fileRegExp.test(entryPath);
        if (result) return result;
      }
    }
    return false;
  };

  const packageRoot = paths.resolve.fromPackage(pkg, "src");
  return helper(packageRoot);
}

function removeEmptyLines(s) {
  return s.split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .join("\n");
}
