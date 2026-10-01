"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { FiCheck, FiClock, FiImage, FiInfo } from "react-icons/fi"
import { SettingsField, SettingsSection, SettingsShell } from "@/features/settings/components/SettingsShell"
import { settingsInputClass } from "@/features/settings/styles"
import { openingDays, type BarbershopSettings, type OpeningDay, type OpeningHours } from "../types"

type AdminSettingsViewProps = { initialSettings: BarbershopSettings }
type TextField = "name" | "description" | "email" | "phone" | "address" | "city"

const sections = [
  { id: "identidade", label: "Identidade" },
  { id: "contato", label: "Contato e endereço" },
  { id: "horarios", label: "Funcionamento" },
] as const

const dayLabels: Record<OpeningDay, string> = {
  seg: "Segunda-feira",
  ter: "Terça-feira",
  qua: "Quarta-feira",
  qui: "Quinta-feira",
  sex: "Sexta-feira",
  sab: "Sábado",
  dom: "Domingo",
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toLocaleUpperCase("pt-BR") || "BH"
}

export function AdminSettingsView({ initialSettings }: AdminSettingsViewProps) {
  const [draft, setDraft] = useState(initialSettings)
  const [saved, setSaved] = useState(initialSettings)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [savedLogo, setSavedLogo] = useState<string | null>(null)
  const [notice, setNotice] = useState("")
  const [logoError, setLogoError] = useState("")
  const [hoursError, setHoursError] = useState("")
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved) || logoPreview !== savedLogo

  function updateField(field: TextField, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
    setNotice("")
  }

  function updateHours(day: OpeningDay, change: Partial<OpeningHours>) {
    setDraft((current) => ({
      ...current,
      hours: { ...current.hours, [day]: { ...current.hours[day], ...change } },
    }))
    setNotice("")
    setHoursError("")
  }

  function selectLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setLogoError("Escolha uma imagem PNG, JPG ou WebP de até 2 MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoPreview(reader.result)
        setLogoError("")
        setNotice("")
      }
    }
    reader.onerror = () => setLogoError("Não foi possível ler a imagem. Tente outro arquivo.")
    reader.readAsDataURL(file)
  }

  function savePreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    for (const day of openingDays) {
      const hours = draft.hours[day]
      if (hours.open && (!hours.start || !hours.end || hours.end <= hours.start)) {
        setHoursError(`Confira o horário de ${dayLabels[day].toLocaleLowerCase("pt-BR")}: o fechamento deve ser posterior à abertura.`)
        document.getElementById("horarios")?.scrollIntoView({ behavior: "smooth", block: "start" })
        return
      }
    }

    setSaved({ ...draft, name: draft.name.trim(), description: draft.description.trim() })
    setDraft((current) => ({ ...current, name: current.name.trim(), description: current.description.trim() }))
    setSavedLogo(logoPreview)
    setLogoError("")
    setHoursError("")
    setNotice("Alterações aplicadas à prévia desta sessão.")
  }

  function discardChanges() {
    setDraft(saved)
    setLogoPreview(savedLogo)
    setLogoError("")
    setHoursError("")
    setNotice("Alterações não aplicadas foram descartadas.")
  }

  return (
    <SettingsShell eyebrow="Área administrativa / preferências" title="Configurações" description="Cuide dos detalhes que apresentam sua barbearia e orientam o atendimento. Cada ajuste tem seu lugar, sem disputar espaço com a operação do dia." navigation={sections}>
      <div className="flex items-start gap-3 rounded-lg border border-[#65d5ff]/20 bg-[#12344a]/35 px-4 py-3 text-sm leading-6 text-slate-300">
        <FiInfo className="mt-1 shrink-0 text-[#65d5ff]" aria-hidden="true" />
        <p>Esta tela é uma prévia interativa. As alterações são locais e desaparecem ao recarregar a página.</p>
      </div>

      <form onSubmit={savePreview}>
        <div className="space-y-5">
          <SettingsSection {...sections[0]} description="O nome, a descrição e a marca que representam o estabelecimento.">
            <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_240px]">
              <div className="space-y-5">
                <SettingsField label="Nome da barbearia" hint="Como você quer que o estabelecimento seja reconhecido.">
                  <input className={settingsInputClass} value={draft.name} onChange={(event) => updateField("name", event.target.value)} maxLength={80} placeholder="Nome da barbearia" required />
                </SettingsField>
                <SettingsField label="Descrição curta" hint="Uma frase para apresentar o estilo da casa.">
                  <textarea className={`${settingsInputClass} min-h-28 resize-y py-3`} value={draft.description} onChange={(event) => updateField("description", event.target.value)} maxLength={240} placeholder="Conte um pouco sobre a barbearia" />
                </SettingsField>
                <div>
                  <p className="text-sm font-medium text-slate-200">Logomarca</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">PNG, JPG ou WebP, até 2 MB. A imagem aparece apenas nesta prévia.</p>
                  <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-200 hover:border-[#65d5ff] hover:text-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#65d5ff]">
                    <FiImage size={16} aria-hidden="true" /> Escolher imagem
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={selectLogo} className="sr-only" aria-label="Escolher logomarca" />
                  </label>
                  {logoPreview && <button type="button" onClick={() => { setLogoPreview(null); setNotice("") }} className="ml-3 min-h-11 text-sm font-medium text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-[#65d5ff]">Remover</button>}
                  {logoError && <p role="alert" className="mt-2 text-xs text-amber-200">{logoError}</p>}
                </div>
              </div>

              <aside aria-label="Prévia da identidade" className="self-start overflow-hidden rounded-xl border border-slate-700/70 bg-[#07111c]">
                <div className="border-b border-slate-800 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Prévia da identidade</div>
                <div className="p-5">
                  {logoPreview ? (
                    <Image src={logoPreview} width={64} height={64} unoptimized alt="Logomarca selecionada" className="size-16 rounded-lg object-cover" />
                  ) : (
                    <div className="grid size-16 place-items-center rounded-lg bg-[#12344a] text-lg font-semibold text-[#8de1ff]" aria-label="Iniciais da barbearia">{initials(draft.name)}</div>
                  )}
                  <p className="mt-5 text-lg font-semibold leading-6 text-white wrap-break-word">{draft.name.trim() || "Sua barbearia"}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-400 wrap-break-word">{draft.description.trim() || "Uma breve apresentação da casa aparecerá aqui."}</p>
                  <div className="mt-5 border-t border-slate-800 pt-4 text-xs text-[#8de1ff]">Sua identidade, em um só lugar.</div>
                </div>
              </aside>
            </div>
          </SettingsSection>

          <SettingsSection {...sections[1]} description="Os canais e o local pelos quais as pessoas encontram sua barbearia.">
            <div className="grid gap-5 sm:grid-cols-2">
              <SettingsField label="E-mail de contato">
                <input type="email" className={settingsInputClass} value={draft.email} onChange={(event) => updateField("email", event.target.value)} placeholder="contato@suabarbearia.com" autoComplete="email" />
              </SettingsField>
              <SettingsField label="Telefone / WhatsApp">
                <input type="tel" className={settingsInputClass} value={draft.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="(00) 00000-0000" autoComplete="tel" />
              </SettingsField>
              <div className="sm:col-span-2">
                <SettingsField label="Endereço">
                  <input className={settingsInputClass} value={draft.address} onChange={(event) => updateField("address", event.target.value)} placeholder="Rua, número e bairro" autoComplete="street-address" />
                </SettingsField>
              </div>
              <SettingsField label="Cidade">
                <input className={settingsInputClass} value={draft.city} onChange={(event) => updateField("city", event.target.value)} placeholder="Sua cidade" autoComplete="address-level2" />
              </SettingsField>
            </div>
          </SettingsSection>

          <SettingsSection {...sections[2]} description="Defina os dias e o intervalo padrão em que o estabelecimento abre.">
            <div className="divide-y divide-slate-800/80">
              {openingDays.map((day) => {
                const hours = draft.hours[day]
                return (
                  <div key={day} className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div className="flex items-center justify-between gap-3 sm:justify-start sm:gap-5">
                      <span className="min-w-27 text-sm font-medium text-slate-200">{dayLabels[day]}</span>
                      <button type="button" aria-pressed={hours.open} aria-label={`${hours.open ? "Fechar" : "Abrir"} ${dayLabels[day]}`} onClick={() => updateHours(day, { open: !hours.open })} className={`min-h-11 min-w-22 rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65d5ff] ${hours.open ? "border-[#65d5ff]/40 bg-[#12344a] text-[#8de1ff]" : "border-slate-700 bg-[#07111c] text-slate-400 hover:text-white"}`}>
                        {hours.open ? "Aberto" : "Fechado"}
                      </button>
                    </div>
                    <div className="flex min-w-0 items-center gap-2 sm:justify-end">
                      <label className="min-w-0 flex-1 sm:w-29 sm:flex-none"><span className="sr-only">Abertura de {dayLabels[day]}</span><input type="time" value={hours.start} onChange={(event) => updateHours(day, { start: event.target.value })} disabled={!hours.open} required={hours.open} className={settingsInputClass} /></label>
                      <span className="text-xs text-slate-500" aria-hidden="true">até</span>
                      <label className="min-w-0 flex-1 sm:w-29 sm:flex-none"><span className="sr-only">Fechamento de {dayLabels[day]}</span><input type="time" value={hours.end} onChange={(event) => updateHours(day, { end: event.target.value })} disabled={!hours.open} required={hours.open} className={settingsInputClass} /></label>
                    </div>
                  </div>
                )
              })}
            </div>
            {hoursError && <p role="alert" className="mt-4 rounded-lg border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-200">{hoursError}</p>}
            <p className="mt-6 border-t border-slate-800 pt-5 text-xs leading-5 text-slate-400"><FiClock className="mr-2 inline-block align-[-2px] text-[#65d5ff]" aria-hidden="true" />A jornada individual de cada profissional é configurada em <Link href="/admin/barbeiros" className="font-semibold text-[#8de1ff] underline underline-offset-2 hover:text-white">Barbeiros</Link>.</p>
          </SettingsSection>

          <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-[#0b1a29] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-sm font-semibold text-white">Sua prévia está {isDirty ? "com alterações" : "atualizada"}</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">Salvar aplica somente nesta sessão; ao recarregar, os dados demonstrativos voltam.</p>
              <p role="status" aria-live="polite" className="mt-1 text-xs text-[#8de1ff]">{notice}</p>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button type="button" onClick={discardChanges} disabled={!isDirty} className="min-h-11 rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-200 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#65d5ff]">Descartar</button>
              <button type="submit" disabled={!isDirty} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#65d5ff] px-5 text-sm font-bold text-[#061522] hover:bg-[#8de1ff] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65d5ff]"><FiCheck size={17} aria-hidden="true" /> Salvar prévia</button>
            </div>
          </div>
        </div>
      </form>
    </SettingsShell>
  )
}
