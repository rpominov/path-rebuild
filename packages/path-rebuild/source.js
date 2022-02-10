import { transformExn } from "rescript-path-rebuild";

export const createTransform = (pattern) => {
  const fn = transformExn(pattern);
  return (path, sep) => fn(sep, path);
};
