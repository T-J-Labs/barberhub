"use client"

import { catalogActionClass } from "@/features/barbershop-catalog/styles"
import { useRouter } from "next/navigation"

export function LoadRecovery({ reset }: { reset: () => void }) {
  const router = useRouter()
  return <main id="main-content" className="mx-auto w-full max-w-3xl px-6 py-16">
    <h1 className="text-3xl font-semibold tracking-tight">Não foi possível carregar esta página.</h1>
    <p role="alert" className="mt-5 text-base leading-7 text-[#B6C2D1]">Verifique sua conexão e tente abrir a página novamente. Isso não confirma disponibilidade nem reenvia agendamentos ou alterações.</p>
    <button type="button" onClick={() => { router.refresh(); reset() }} className={`${catalogActionClass} mt-6`}>Tentar novamente</button>
  </main>
}
