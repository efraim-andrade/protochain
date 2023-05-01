export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/lib/**/*.ts",
    "<rootDir>/src/server/**/*.ts",
  ],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/src/lib/blockInfo.ts"],
  coverageProvider: "v8",
  coverageReporters: ["text", "lcov"],
  preset: "ts-jest",
  testMatch: ["**/__tests__/**/*.ts"],
  setupFiles: ["dotenv/config"],
};
