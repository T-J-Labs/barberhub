"use client"

import { useEffect, useId, useRef, type ReactNode } from "react"
import { FiX } from "react-icons/fi"

type DemoDialogProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  tone?: "admin" | "public"
}

const dialogTone = {
  admin: {
    surface: "border-slate-700 bg-[#0b1a29]",
    divider: "border-slate-800",
    close: "hover:bg-[#12344a] focus-visible:outline-[#65d5ff]",
  },
  public: {
    surface: "border-[#26384A] bg-[#0D1722]",
    divider: "border-[#26384A]",
    close: "hover:bg-[#172535] focus-visible:outline-sky-400",
  },
} as const

// QA: manter tarefa e foco dentro da janela; hierarquia, Geist, paleta,
// superfícies, bordas e ritmo de 4px existentes permanecem iguais.
export function DemoDialog({ open, onClose, title, description, children, tone = "admin" }: DemoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const colors = dialogTone[tone]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return
        const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')]
          .filter((element) => element.checkVisibility() && element.tabIndex >= 0)
        const first = controls[0], last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={`m-auto max-h-[min(90dvh,760px)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-xl border p-0 text-white backdrop:bg-black/70 ${colors.surface}`}
    >
      <div className={`flex items-start justify-between gap-4 border-b px-5 py-5 sm:px-6 ${colors.divider}`}>
        <div className="min-w-0 break-words">
          <h2 id={titleId} className="text-xl font-semibold tracking-tight">{title}</h2>
          {description && <p id={descriptionId} className="mt-1 text-sm leading-6 text-slate-400">{description}</p>}
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar janela" className={`grid size-11 shrink-0 place-items-center rounded-lg text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 ${colors.close}`}>
          <FiX size={19} aria-hidden="true" />
        </button>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </dialog>
  )
}
