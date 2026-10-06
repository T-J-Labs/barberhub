"use client"

import { useRef, useState, type FormEvent } from "react"
import { SettingsField } from "@/features/settings/components/SettingsShell"
import { catalogActionClass, catalogFieldClass, catalogSecondaryActionClass } from "@/features/barbershop-catalog/styles"
import { settingsInputClass } from "@/features/settings/styles"
import { validateDemoName } from "../name"
import { useDemoProfile } from "./DemoProfileProvider"

export function DemoProfileForm({ role }: { role: "cliente" | "barbeiro" }) {
  const profile = useDemoProfile()
  const [draft, setDraft] = useState(profile.name)
  const [lastApplied, setLastApplied] = useState(profile.name)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const input = useRef<HTMLInputElement>(null)
  const secondary = `${catalogSecondaryActionClass} w-full sm:w-auto`
  // An external reset (leaving the header preview) must also discard its draft.
  if (lastApplied !== profile.name) {
    setLastApplied(profile.name)
    setDraft(profile.name)
    setError("")
    if (draft !== profile.name) setNotice("Apresentação reiniciada. O nome fictício inicial voltou à demonstração.")
  }
  function apply(event: FormEvent) {
    event.preventDefault()
    const result = validateDemoName(draft)
    if (result.error !== null) { setError(result.error); setNotice(""); input.current?.focus(); return }
    profile.apply(result.name)
    setDraft(result.name)
    setError("")
    setNotice("Nome aplicado à demonstração. Nada foi salvo em uma conta real.")
  }
  return <div className="grid min-w-0 gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(0,280px)]">
    <form onSubmit={apply} noValidate className="min-w-0 space-y-5">
      <SettingsField label="Nome de exibição">
        <input ref={input} id="demo-name" value={draft} onChange={event => { setDraft(event.target.value); setError(""); setNotice("") }} autoComplete="off" aria-invalid={Boolean(error)} aria-describedby={`name-hint${error ? " name-error" : ""}`} className={role === "cliente" ? catalogFieldClass : settingsInputClass} />
      </SettingsField>
      <p id="name-hint" className="text-sm leading-6 text-slate-400">Use acentos e espaços internos. Espaços no início e no fim serão removidos.</p>
      {error && <p id="name-error" role="alert" className="text-sm leading-6 text-amber-200">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="submit" className={role === "cliente" ? `${catalogActionClass} w-full sm:w-auto` : "min-h-11 w-full rounded-lg bg-[#65d5ff] px-4 py-3 text-sm font-semibold text-[#07111c] hover:bg-[#8de1ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65d5ff] sm:w-auto"}>Aplicar à demonstração</button>
        <button type="button" className={secondary} onClick={() => { setDraft(profile.name); setError(""); setNotice("Edição cancelada. O último nome aplicado foi mantido.") }}>Cancelar edição</button>
        <button type="button" className={secondary} onClick={() => { profile.restore(); setDraft(profile.initialName); setError(""); setNotice("Exemplo restaurado. O nome fictício inicial voltou à demonstração.") }}>Restaurar exemplo</button>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className="min-h-6 text-sm leading-6 text-slate-300">{notice}</p>
    </form>
    <aside aria-label="Nome aplicado à demonstração" className="min-w-0 self-start rounded-lg border border-slate-700 bg-[#07111C] p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Apresentação local</p>
      <p className="mt-4 text-xl font-semibold leading-8 text-white [overflow-wrap:anywhere]">{profile.name}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">Identidade fictícia · {role}. O rascunho só aparece aqui depois de aplicar.</p>
    </aside>
  </div>
}
