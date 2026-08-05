import { defineConfig } from "orval";

export default defineConfig({
  barberHub: {
    input: {
      target: "../docs/api/openapi.yaml",
    },
    output: {
      mode: "single",
      target: "./src/lib/api/generated/barberhub.ts",
      schemas: "./src/lib/api/generated/models",
      client: "axios-functions",
      clean: true,
      mock: {
        generators: [
          {
            type: "msw",
            delay: 300,
          },
        ],
      },
      override: {
        mutator: {
          path: "./src/lib/api/axios-instance.ts",
          name: "apiClient",
        },
      },
    },
  },
});
