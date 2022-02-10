const { transformExn } = require("rescript-path-rebuild");

exports.transform = (pattern) => {
  const fn = transformExn(pattern);
  return (path, sep) => fn(sep, path);
};
