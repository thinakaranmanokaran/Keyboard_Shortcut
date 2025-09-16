import terser from "@rollup/plugin-terser";

export default [
    {
        input: "src/index.js",
        output: [
            { file: "dist/index.cjs.js", format: "cjs" },
            { file: "dist/index.mjs", format: "es" }
        ],
        plugins: [terser()]
    },
    {
        input: "src/react.js",
        output: [
            { file: "dist/react.cjs.js", format: "cjs" },
            { file: "dist/react.mjs", format: "es" }
        ],
        external: ["react"],
        plugins: [terser()]
    }
];
