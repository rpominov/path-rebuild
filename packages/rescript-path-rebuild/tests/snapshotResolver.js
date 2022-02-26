const { sep } = require("path");

module.exports = {
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    return (
      testPath.replace(
        `${sep}lib${sep}js${sep}tests${sep}`,
        `${sep}tests${sep}__snapshots__${sep}`
      ) + snapshotExtension
    );
  },
  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    return snapshotFilePath
      .replace(
        `${sep}tests${sep}__snapshots__${sep}`,
        `${sep}lib${sep}js${sep}tests${sep}`
      )
      .slice(0, -snapshotExtension.length);
  },
  testPathForConsistencyCheck:
    "/projects/path-rebuild/packages/rescript-path-rebuild/lib/js/tests/Main.test.bs.js",
};
