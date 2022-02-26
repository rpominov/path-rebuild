const path = require("path");
const { transformExn } = require("../lib/js/PathRebuild.bs.js");

module.exports = {
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    const { root } = path.parse(testPath);
    return (
      root +
      transformExn(`{0..-6}/{-3}/__snapshots__/{-2..-1}${snapshotExtension}`)(
        undefined,
        testPath.slice(root.length)
      )
    );
  },
  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    const { root } = path.parse(snapshotFilePath);
    return (
      root +
      transformExn("{0..-5}/lib/js/{-4}/{-2}")(
        undefined,
        snapshotFilePath.slice(root.length)
      )
    );
  },
  testPathForConsistencyCheck:
    "/rescript-path-rebuild/lib/js/tests/Main.test.bs.js"
      .split("/")
      .join(path.sep),
};
