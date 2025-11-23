import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,

  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
  ],

  banner: {
    js: '"use client";',
  },

  treeshake: false,

  esbuildOptions(options) {
    options.treeShaking = false;
    options.pure = [];
    options.jsx = "automatic";
  },

  minify: false,
  target: "es2020",
});
