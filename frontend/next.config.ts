import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Não inferir tenants de hosts arbitrários ou de X-Forwarded-Host.
    // O domínio de produção deve ser configurado explicitamente pelo operador.
    const publicHost = process.env.BARBERHUB_PUBLIC_HOST ?? (process.env.NODE_ENV === "development" ? "localhost" : undefined);
    if (!publicHost) return [];
    if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(publicHost)) {
      throw new Error("BARBERHUB_PUBLIC_HOST deve ser um hostname sem protocolo, porta ou caminho.");
    }
    return { beforeFiles: [{
      source: "/",
      has: [{ type: "host" as const, value: `(?<subdomain>[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)\\.${publicHost.replace(/\./g, "\\.")}` }],
      destination: "/barbearias/:subdomain",
    }], afterFiles: [], fallback: [] };
  },
};

export default nextConfig;
