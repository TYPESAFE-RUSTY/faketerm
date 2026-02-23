import { defineConfig } from "tsup";

export default defineConfig({
  // The entry point(s) of library
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  bundle: true,
  splitting: false,
});
