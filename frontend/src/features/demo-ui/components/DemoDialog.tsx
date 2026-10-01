"use client"

import { useEffect, useId, useRef, type ReactNode } from "react"
import { FiX } from "react-icons/fi"

type DemoDialogProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
}

export function DemoDialog({ open, onClose, title, description, children }: DemoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

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
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className="m-auto max-h-[min(90dvh,760px)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-xl border border-slate-700 bg-[#0b1a29] p-0 text-white backdrop:bg-black/70"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-5 sm:px-6">
        <div>
          <h2 id={titleId} className="text-xl font-semibold tracking-tight">{title}</h2>
          {description && <p id={descriptionId} className="mt-1 text-sm leading-6 text-slate-400">{description}</p>}
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar janela" className="grid size-11 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-[#12344a] hover:text-white focus-visible:outline-2 focus-visible:outline-[#65d5ff]">
          <FiX size={19} aria-hidden="true" />
        </button>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </dialog>
  )
}
