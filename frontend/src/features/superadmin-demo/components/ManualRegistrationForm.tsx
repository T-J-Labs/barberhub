"use client"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useSuperadminDemo } from "./SuperadminProvider"
import { detailsHref } from "../presentation"
import { emptyRegistration, registrationLimits, type RegistrationDraft, type RegistrationErrors } from "../registration"
import { actionClass, inputClass, panelClass } from "../styles"

const fields = [
  { key: "name", label: "Nome da barbearia" },
  { key: "city", label: "Cidade" },
  { key: "neighborhood", label: "Bairro" },
  { key: "subdomain", label: "Subdomínio pretendido" },
  { key: "manualReason", label: "Motivo do cadastro manual" },
] as const

// Intenção: operador registra um rascunho com motivo, sem provisionar uma loja.
// Hierarquia: título focado 20px, campos 14px, limite/erro junto ao campo. Paleta
// privada, superfície #0b1a29 e inputs #07111c, bordas sutis, Geist, base 4px,
// padding 20px e alvos 44px preservam o formulário administrativo embutido.
export function ManualRegistrationForm({ query, onCancel }: { query: string; onCancel: () => void }) {
  const { createDraft } = useSuperadminDemo()
  const router = useRouter()
  const [draft, setDraft] = useState<RegistrationDraft>(emptyRegistration)
  const [errors, setErrors] = useState<RegistrationErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const submittedRef = useRef(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const fieldRefs = useRef<Partial<Record<keyof RegistrationDraft, HTMLInputElement | HTMLTextAreaElement>>>({})
  useEffect(() => { titleRef.current?.focus() }, [])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittedRef.current) return
    submittedRef.current = true
    const result = createDraft(draft)
    if (result.errors) {
      submittedRef.current = false
      setErrors(result.errors)
      const first = fields.find(field => result.errors[field.key])
      if (first) fieldRefs.current[first.key]?.focus()
      return
    }
    setSubmitting(true)
    router.push(detailsHref(result.id, query))
  }
  return <form noValidate onSubmit={submit} aria-labelledby="registration-title" className={`${panelClass} p-5`}>
    <h2 id="registration-title" ref={titleRef} tabIndex={-1} className="rounded text-xl font-semibold focus-visible:outline-2 focus-visible:outline-[#65d5ff]">Cadastro manual demonstrativo</h2>
    <p className="mt-2 text-sm leading-6 text-slate-400">Crie somente um rascunho local. Nenhuma compra, conta, publicação ou subdomínio real será criado. Use dados de exemplo.</p>
    <div className="mt-5 grid gap-5 sm:grid-cols-2">
      {fields.map(({ key, label }) => {
        const id = `registration-${key}`
        const shared = {
          id, name: key, required: true, maxLength: registrationLimits[key], value: draft[key],
          "aria-invalid": errors[key] ? true : undefined,
          "aria-describedby": `${id}-help${errors[key] ? ` ${id}-error` : ""}`,
          className: `${inputClass} mt-2`, disabled: submitting,
          onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(current => ({ ...current, [key]: event.target.value })),
        }
        return <div key={key} className={key === "manualReason" ? "sm:col-span-2" : "min-w-0"}>
          <label htmlFor={id} className="block text-sm font-medium">{label} <span className="font-normal text-slate-400">(obrigatório)</span></label>
          {key === "manualReason" ? <textarea {...shared} rows={3} ref={element => { fieldRefs.current[key] = element ?? undefined }} /> : <input {...shared} type="text" autoCapitalize={key === "subdomain" ? "none" : "sentences"} spellCheck={key !== "subdomain"} ref={element => { fieldRefs.current[key] = element ?? undefined }} />}
          <p id={`${id}-help`} className="mt-1 text-xs leading-5 text-slate-400">Até {registrationLimits[key]} caracteres.{key === "subdomain" && " Letras de a a z, números e hífens internos. Maiúsculas serão normalizadas. Disponibilidade na amostra não garante disponibilidade real."}</p>
          {errors[key] && <p id={`${id}-error`} className="mt-1 text-sm leading-6 text-rose-300">{errors[key]}</p>}
        </div>
      })}
    </div>
    <p role="alert" className="mt-4 text-sm text-rose-300">{Object.keys(errors).length > 0 ? "Confira os campos indicados. Os valores preenchidos foram preservados." : ""}</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="submit" disabled={submitting} className={`${actionClass} disabled:opacity-60`}>Criar na demonstração</button><button type="button" disabled={submitting} onClick={onCancel} className={actionClass}>Cancelar</button></div>
  </form>
}
