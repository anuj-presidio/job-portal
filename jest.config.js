module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "json"],
  modulePaths: ["<rootDir>/node_modules"],
  setupFilesAfterEnv: ["jest-extended"],
  setupFiles: ["jest-plugin-context/setup"],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
};
