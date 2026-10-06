// Display only; never replaces a fixture ID, Google identity or authorization.
export function validateDemoName(draft: string): { name: string; error: null } | { name: null; error: string } {
  const name = draft.trim()
  return name ? { name, error: null } : { name: null, error: "Informe um nome de exibição. Espaços sozinhos não são válidos." }
}
