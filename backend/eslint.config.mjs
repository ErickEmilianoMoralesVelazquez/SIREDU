import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: [
      "js/recommended",
      "plugin:prettier/recommended"  // integra Prettier
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      sourceType: "module",
      ecmaVersion: 2021,
    },
    rules: {
    },
  },
]);
