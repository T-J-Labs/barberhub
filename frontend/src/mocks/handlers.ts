import type { RequestHandler } from "msw";

// Enquanto o contrato não possui endpoints, não existem handlers para gerar.
// Quando o primeiro endpoint for aprovado, importe aqui o agregador criado pelo
// Orval em src/lib/api/generated/barberhub.msw.ts.
export const handlers: RequestHandler[] = [];
