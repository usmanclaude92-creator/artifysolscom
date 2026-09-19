// @ts-check
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

// Scoped to src/lib only (Phase 1's additions) — the existing ~100+
// component src/ tree and the legacy server/ directory are not linted yet;
// see docs/CI_CD.md (Artify-Backend repo) for the phased rollout plan
// mirrored here.
export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["src/lib/**/*.ts", "src/lib/**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
