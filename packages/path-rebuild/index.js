const { transformExn } = require("rescript-path-rebuild");

exports.createTransform = (pattern) => {
  const fn = transformExn(pattern);
  return (path, sep) => fn(sep, path);
};
