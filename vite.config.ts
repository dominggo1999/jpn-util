/// <reference types="vitest" />
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodeResolve } from "@rollup/plugin-node-resolve";
// import shebang from "rollup-plugin-preserve-shebang";

import { builtinModules } from "module";

console.log(builtinModules);

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  resolve: {
    alias: [
      { find: "~", replacement: resolve(__dirname, "./src") },
      { find: "kagome", replacement: resolve(__dirname, "./kagome") },
      { find: "db", replacement: resolve(__dirname, "./db") },
      { find: "helpers", replacement: resolve(__dirname, "./db") },
    ],
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "index",
      fileName: "index",
    },
    rollupOptions: {
      // If you are building a library, make sure to externalize deps, since we don't want to bundle them
      external: [...builtinModules],
    },
  },
  plugins: [
    tsconfigPaths(),
    dts(),
    nodeResolve(),

    // Uncomment this line when building a cli to preserve the shebang on the entry file
    // Don't forget to add "#!/usr/bin/env node" on the very top of the entry file
    // shebang({
    //   shebang: "#!/usr/bin/env node",
    // }),
  ],
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "json", "html"],
    },
  },
});
