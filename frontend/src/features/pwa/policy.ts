/** O mesmo domínio-base validado pelo roteamento, nunca X-Forwarded-Host. */
export function isPwaHost(host: string | null, publicHost: string | undefined) {
  if (!host || !publicHost || !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(publicHost)) return false
  if (!/^[a-z0-9.-]+(?::[0-9]+)?$/i.test(host)) return false
  try {
    const url = new URL(`https://${host}`)
    return url.hostname === publicHost && (!url.port || publicHost === "localhost")
  } catch { return false }
}

export function canRegisterPwa(host: string, publicHost: string | undefined, production: boolean, mocking: boolean, secure: boolean) {
  return production && !mocking && secure && isPwaHost(host, publicHost)
}
