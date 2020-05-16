module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^~/(.*)$": "<rootDir>/$1",
    "^vue$": "vue/dist/vue.common.js",
  },
  moduleFileExtensions: ["js", "ts", "vue", "json"],
  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest",
    "^.+\\.vue$": "vue-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/bootstrap.ts"],
  collectCoverage: false,
  collectCoverageFrom: [
    "<rootDir>/components/*.vue)",
    "<rootDir>/pages/**/*.vue)",
    "<rootDir>/models/**/*.ts)",
  ],
  coverageDirectory: "<rootDir>/test/out/coverage",
  coverageReporters: ["html", "text-summary"],
  snapshotSerializers: ["jest-serializer-vue"],
};
