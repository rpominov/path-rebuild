import { transformExn } from "rescript-path-rebuild/lib/es6/PathRebuild.bs.js";

export const createTransform = (pattern) => {
  const fn = transformExn(pattern);
  return (path, sep) => fn(sep, path);
};
