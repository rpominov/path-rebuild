import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "source.js",
  output: {
    file: "index.js",
    format: "commonjs",
    compact: true,
  },
  plugins: [nodeResolve(), commonjs()],
};
