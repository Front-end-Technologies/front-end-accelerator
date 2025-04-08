import eslint from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  reactRefresh.configs.recommended,
  reactHooks.configs["recommended-latest"],
  perfectionist.configs["recommended-natural"],
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["dist"],
  },
];
