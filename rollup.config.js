import { defineConfig } from "rollup";
import terser from "@rollup/plugin-terser";

export default defineConfig([
    {
        input: "src/index.js",
        output: [
            { file: "dist/index.mjs", format: "esm" },
            { file: "dist/index.cjs", format: "cjs" }
        ],
        plugins: [terser()]
    },
    {
        input: "src/react.js",
        output: [
            { file: "dist/react.mjs", format: "esm" },
            { file: "dist/react.cjs", format: "cjs" }
        ],
        external: ["react"], // don’t bundle React
        plugins: [terser()]
    }
]);
