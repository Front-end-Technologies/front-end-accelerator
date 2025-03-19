import perfectionist from "eslint-plugin-perfectionist";
import tseslint from "typescript-eslint";

export default tseslint.config({
  extends: [
    perfectionist.configs["recommended-natural"],
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked,

    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
  ],
  rules: {
    "@typescript-eslint/no-floating-promises": "error",
    "no-console": ["warn"],
  },
});
