import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs", // It is required to work with the CommonJS module system used in Node.js (for example, require and module.exports).
      globals: {
        ...globals.node, // Add Node.js global variables
      },
    },
  },
  pluginJs.configs.recommended,
];
