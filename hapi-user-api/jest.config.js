export default {
    transform: {
      "^.+\\.js$": "babel-jest",
    },
    testEnvironment: "node",
    testMatch: [
      "**/tests/**/*.test.js",
      "**/tests/**/*.spec.js",
    ],
    collectCoverageFrom: [
      "src/**/*.js",
      "!src/index.js",
    ],
    coverageDirectory: "coverage",
    verbose: true,
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    // This line ensures that Jest treats all .js files as ES modules
    extensionsToTreatAsEsm: [],
  };
  