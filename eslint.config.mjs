import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  ignores: ["dist", "node_modules"]
}, {
  extends: [
    js.configs.recommended, ...tseslint.configs.recommended,
  ],
  files: ["**/*.ts"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    "@typescript-eslint/no-shadow": [
      "error",
      {
        builtinGlobals: false,
        hoist: "functions",
        allow: []
      }
    ],
    indent: ["error", 2],
    eqeqeq: [
      "error",
      "always",
      {
        "null": "ignore"
      }
    ],
    quotes: ["error", "single"],
    "linebreak-style": ["error", "unix"]
  }
},);
