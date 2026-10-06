import type { NextConfig } from "next";
import { getConfiguredPublicHost } from "./src/features/public-barbershop/host-config";

getConfiguredPublicHost();
const nextConfig: NextConfig = {
  // QA isolado não compartilha locks/artefatos com o dev pessoal.
  distDir: process.env.TEST_NEXT_DIST_DIR || ".next",
  typescript: { tsconfigPath: process.env.TEST_NEXT_TS_CONFIG || "tsconfig.json" },
  // Preserve the internal server origin; normalizing 127.0.0.1 to localhost
  // would turn the tenant rewrite into an external proxy and replace Host.
  skipProxyUrlNormalize: true,
};

export default nextConfig;
