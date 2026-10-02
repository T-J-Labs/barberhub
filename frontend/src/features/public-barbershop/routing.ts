/** A mesma chave pública é usada no caminho e na entrada por subdomínio. */
export function isPublicSubdomain(value: string) {
  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(value)
}

export function publicBarbershopHref(subdomain: string) {
  if (!isPublicSubdomain(subdomain)) throw new Error("Identificador público inválido.")
  return `/barbearias/${subdomain}`
}
