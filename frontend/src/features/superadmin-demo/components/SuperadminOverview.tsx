"use client"
import Link from "next/link"
import { useSuperadminDemo } from "./SuperadminProvider"
import { summarizeShops } from "../presentation"
import { actionClass, panelClass } from "../styles"
import { SuperadminState } from "./SuperadminState"

// Intenção: dimensionar a amostra antes de consultar a lista. Total lidera em 36px,
// estados em 24px; sem métricas de operação. Paleta privada, bordas, Geist e base 4px.
export function SuperadminOverview() {
  const { shops, scenario, setScenario } = useSuperadminDemo()
  if (scenario === "loading" || scenario === "error") return <SuperadminState kind={scenario} onRetry={scenario === "error" ? () => setScenario("ready") : undefined} />
  const summary = summarizeShops(shops)
  return <section className={`${panelClass} p-6`} aria-labelledby="sample-title">
    <h2 id="sample-title" className="text-lg font-semibold">Barbearias da amostra</h2>
    <p className="mt-2 text-sm text-slate-400">Contagens calculadas a partir dos exemplos locais, incluindo alterações demonstrativas.</p>
    <dl aria-live="polite" className="my-7 grid grid-cols-1 gap-6 min-[390px]:grid-cols-2 sm:grid-cols-4">
      {[['Total', summary.total], ['Rascunhos', summary.drafts], ['Ativas', summary.active], ['Suspensas', summary.suspended]].map(([label, value], index) => <div key={label}>
        <dt className="text-sm text-slate-400">{label}</dt><dd className={`mt-2 font-semibold tabular-nums ${index === 0 ? "text-4xl" : "text-2xl"}`}>{value}</dd>
      </div>)}
    </dl>
    {shops.length === 0 && <div className="mb-6"><SuperadminState kind="empty" /></div>}
    <Link href="/super-admin/barbearias" className={actionClass}>Consultar barbearias</Link>
  </section>
}
