"use client"
import { useSuperadminDemo } from "./SuperadminProvider"
import { inputClass } from "../styles"

// Controle de QA somente em desenvolvimento; mesmas superfícies/Geist e alvo de 44px.
export function DemoScenarios() {
  const { scenario, setScenario } = useSuperadminDemo()
  return <details className="mb-6 text-sm text-slate-400"><summary className="min-h-11 cursor-pointer rounded-lg py-3 focus-visible:outline-2 focus-visible:outline-[#65d5ff]">Cenários locais de QA (desenvolvimento)</summary>
    <label className="block max-w-sm pb-4">Estado da amostra<select className={`${inputClass} mt-2`} value={scenario} onChange={event => setScenario(event.target.value as typeof scenario)}>
      <option value="ready">Amostra disponível</option><option value="loading">Carregamento</option><option value="error">Erro local</option><option value="empty">Lista vazia</option>
    </select></label>
  </details>
}
