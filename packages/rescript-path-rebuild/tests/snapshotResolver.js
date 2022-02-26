module.exports = {
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    return (
      testPath.replace("/lib/js/tests/", "/tests/__snapshots__/") +
      snapshotExtension
    );
  },
  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    return snapshotFilePath
      .replace("/tests/__snapshots__/", "/lib/js/tests/")
      .slice(0, -snapshotExtension.length);
  },
  testPathForConsistencyCheck:
    "/projects/path-rebuild/packages/rescript-path-rebuild/lib/js/tests/Main.test.bs.js",
};
