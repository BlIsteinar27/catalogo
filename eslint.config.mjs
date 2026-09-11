import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/app/page-client.tsx", "src/components/dashboard/product-table.tsx"],
    rules: {
      // La regla prohíbe setState en effect, pero estos componentes necesitan
      // resetear estado derivado cuando cambian filtros/props (precio, moneda, paginación).
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
