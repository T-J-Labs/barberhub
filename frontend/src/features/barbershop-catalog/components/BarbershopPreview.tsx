"use client"

import { useState } from "react"
import { DemoDialog } from "@/features/demo-ui/components/DemoDialog"
import type { BarbershopPresentation } from "../types"
import { catalogSecondaryActionClass } from "../styles"

export function BarbershopPreview({ shop }: { shop: BarbershopPresentation }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Conhecer ${shop.name} (prévia)`} className={`mt-6 w-full ${catalogSecondaryActionClass}`}>
        Conhecer barbearia <span className="font-normal text-slate-400">(prévia)</span>
      </button>
      <DemoDialog tone="public" open={open} onClose={() => setOpen(false)} title={shop.name} description={`${shop.neighborhood}, ${shop.city}`}>
        <p className="text-sm leading-6 text-slate-300">Este estabelecimento é fictício e faz parte da demonstração do catálogo.</p>
        <p className="mt-3 text-sm leading-6 text-slate-400">A página completa da barbearia, seus serviços e o agendamento estarão disponíveis em uma próxima etapa.</p>
      </DemoDialog>
    </>
  )
}
