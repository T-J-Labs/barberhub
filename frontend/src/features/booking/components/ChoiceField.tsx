"use client"

import { catalogFocusClass } from "@/features/barbershop-catalog/styles"

type Option = { key: string; label: string; description?: string; detail?: string }
type Props = { name: string; legend: string; options: Option[]; value: string; onChange: (value: string) => void; error?: string; compact?: boolean; describedBy?: string }

// Intenção: escolher um cuidado ou horário pelo celular. O nome lidera, os detalhes apoiam.
// Radios nativos; superfície inset do perfil, bordas discretas, Geist 16/14px, grade de 4px.
export function ChoiceField({ name, legend, options, value, onChange, error, compact, describedBy }: Props) {
  const descriptionIds = [describedBy, error ? `${name}-error` : undefined].filter(Boolean).join(" ") || undefined
  return <fieldset aria-describedby={descriptionIds}>
    <legend className="mb-4 text-sm font-medium text-slate-300">{legend}</legend>
    <div className={compact ? "grid grid-cols-2 gap-3 sm:grid-cols-3" : "space-y-3"}>
      {options.map((option) => <label key={option.key} className="block cursor-pointer">
        <input type="radio" name={name} value={option.key} checked={value === option.key} onChange={() => onChange(option.key)} aria-describedby={descriptionIds} className="peer sr-only" />
        <span className={`grid min-h-12 items-start gap-3 ${option.detail ? "grid-cols-[minmax(0,1fr)_5rem_1rem]" : "grid-cols-[minmax(0,1fr)_1rem]"} rounded-lg border border-[#334155] bg-[#07111C] p-4 peer-checked:border-sky-400 peer-checked:bg-sky-500/10 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-sky-400 hover:border-sky-400/60 ${catalogFocusClass}`}>
          <span className="min-w-0 font-semibold">{option.label}</span>
          {option.detail && <span className="text-right text-sm font-medium whitespace-nowrap tabular-nums text-sky-300">{option.detail}</span>}
          <span aria-hidden="true" className={`mt-1 size-4 shrink-0 rounded-full border ${value === option.key ? "border-4 border-sky-400" : "border-slate-500"}`} />
          {option.description && <span className="col-span-full -mt-1 text-sm leading-6 text-[#B6C2D1]">{option.description}</span>}
        </span>
      </label>)}
    </div>
    {error && <p id={`${name}-error`} role="alert" className="mt-3 text-sm text-amber-200">{error}</p>}
  </fieldset>
}
