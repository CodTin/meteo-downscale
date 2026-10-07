import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwindcss from "eslint-plugin-tailwindcss";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tailwindcss.configs["flat/recommended"],
  {
    rules: {
      // Prevent hardcoded colors and spacing (YU-322 requirement)
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^#[0-9A-Fa-f]{3,8}$/]",
          message: "Hardcoded hex colors are not allowed. Use design tokens from CSS variables (e.g., var(--neutral-500)) or Tailwind classes (e.g., text-neutral-500).",
        },
        {
          selector: "Literal[value=/^rgb\\(|^rgba\\(/]",
          message: "Hardcoded RGB colors are not allowed. Use design tokens from CSS variables or Tailwind classes.",
        },
        {
          selector: "Literal[value=/^\\d+px$/]",
          message: "Hardcoded pixel spacing is not allowed. Use spacing tokens (e.g., space-4) or Tailwind spacing classes (e.g., p-4, m-2).",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
