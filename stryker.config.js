// Check out Stryker at: https://stryker-mutator.io/

import values from "./.values.cjs";

const {
  cacheDir,
  packagesCoverageExclusions,
  packagesDir,
  packagesExpr,
  packagesList,
  reportsDir,
  srcDir,
  tempDir,
  testDirUnit,
  testsDir,
  testSuffix,
} = values;

const reportIdentifier = packagesList.length > 1 ? "_mixed" : packagesList[0];

const oldThreshold = [
  // NOTE: It is not allowed to add new items to this list.
  "language-css",
  "language-html",
  "language-js",
  "mangler-html-attributes",
];

export default {
  coverageAnalysis: "perTest",
  inPlace: false,
  mutate: [
    `${packagesDir}/${packagesExpr}/${srcDir}/**/*.ts`,
    `!**/${testsDir}/**/*.ts`,
    ...packagesCoverageExclusions.map((exclusion) => `!${exclusion}`),
  ],

  testRunner: "mocha",
  mochaOptions: {
    config: ".mocharc.cjs",
    spec: [
      [
        packagesDir,
        packagesExpr,
        "**",
        testsDir,
        testDirUnit,
        `*.${testSuffix}.ts`,
      ].join("/"),
    ],
  },

  incremental: true,
  incrementalFile: `${cacheDir}/mutation/${packagesList.join(",")}.json`,

  timeoutMS: 25000,
  timeoutFactor: 2.5,

  disableTypeChecks: `${packagesDir}/${packagesExpr}/${srcDir}/**/*.ts`,
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.build.json",

  reporters: [
    "clear-text",
    "dashboard",
    "html",
    "progress",
  ],
  dashboard: {
    module: packagesList[0],
  },
  htmlReporter: {
    fileName: `${reportsDir}/mutation/${reportIdentifier}/index.html`,
  },
  thresholds: {
    high: 95,
    low: 90,
    break: oldThreshold.includes(packagesList[0]) ? 50 : 90,
  },

  tempDirName: `${tempDir}/stryker`,
  cleanTempDir: true,
};
