/** A mesma chave pública é usada no caminho e na entrada por subdomínio. */
export function isPublicSubdomain(value: string) {
  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(value)
}

/** Só gerar links por subdomínio dentro do domínio público configurado. */
export function publicHostContext(host: string | null, publicHost: string | undefined, protocol: "http:" | "https:") {
  if (!host || !publicHost || !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(publicHost)) return undefined
  if (!/^[a-z0-9.-]+(?::[0-9]+)?$/i.test(host)) return undefined
  try {
    const origin = new URL(`${protocol}//${host}`)
    origin.hostname = origin.hostname.replace(/\.$/, "")
    const subdomain = origin.hostname.endsWith(`.${publicHost}`)
      ? origin.hostname.slice(0, -publicHost.length - 1)
      : undefined
    if (origin.hostname !== publicHost && (!subdomain || !isPublicSubdomain(subdomain))) return undefined
    const canonicalHost = origin.host
    origin.hostname = publicHost
    return { origin: origin.origin, canonicalHost, subdomain }
  } catch {
    return undefined
  }
}

export function publicBarbershopOrigin(host: string | null, publicHost: string | undefined, protocol: "http:" | "https:") {
  return publicHostContext(host, publicHost, protocol)?.origin
}

export function publicBarbershopHref(subdomain: string, publicOrigin: string) {
  if (!isPublicSubdomain(subdomain)) throw new Error("Identificador público inválido.")
  if (!publicOrigin) throw new Error("Domínio público não configurado.")
  const destination = new URL(publicOrigin)
  destination.hostname = `${subdomain}.${destination.hostname}`
  return destination.href
}
