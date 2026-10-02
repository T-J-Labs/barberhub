export function getConfiguredPublicHost() {
  const host = process.env.BARBERHUB_PUBLIC_HOST ?? (process.env.NODE_ENV === "development" ? "localhost" : undefined)
  if (host && !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(host)) {
    throw new Error("BARBERHUB_PUBLIC_HOST deve ser um hostname sem protocolo, porta ou caminho.")
  }
  return host
}
