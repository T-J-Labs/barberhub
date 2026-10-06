import { actionClass, panelClass } from "../styles"

const content = {
  loading: ["Preparando a amostra", "Carregando a demonstração de barbearias."],
  error: ["Não foi possível exibir a amostra", "Nenhum dado real foi consultado ou alterado. Tente novamente."],
  empty: ["Nenhuma barbearia na amostra", "O resumo e a lista ficarão disponíveis quando houver exemplos."],
  missing: ["Exemplo indisponível", "Este identificador não corresponde a um exemplo disponível. Rascunhos são removidos ao recarregar ou sair da área."],
} as const

// Intenção: explicar a ausência do conteúdo; título lidera, sem ilustração decorativa.
// Mesma paleta privada, bordas sutis, Geist 18/14px e espaçamento de 4px/24px.
export function SuperadminState({ kind, onRetry }: { kind: keyof typeof content; onRetry?: () => void }) {
  return <section aria-live="polite" aria-busy={kind === "loading"} className={`${panelClass} p-6`}>
    <h2 className="text-lg font-semibold">{content[kind][0]}</h2>
    <p className="mt-2 text-sm leading-6 text-slate-400">{content[kind][1]}</p>
    {onRetry && <button type="button" onClick={onRetry} className={`${actionClass} mt-4`}>Tentar novamente</button>}
  </section>
}
