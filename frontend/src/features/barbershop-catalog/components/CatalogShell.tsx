import type { ReactNode } from "react"
import { Container } from "@/components/ui/Container"

export function CatalogShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#07111C] py-8 text-white sm:py-12" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
      <Container>
        <header className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">Encontre sua próxima barbearia</h1>
          <p className="mt-4 text-base leading-7 text-[#B6C2D1]">Do seu bairro ou de um novo caminho. Busque pelo nome, cidade ou bairro e conheça os estabelecimentos.</p>
        </header>
        <p className="mt-6 border-l-2 border-sky-400 pl-3 text-sm leading-6 text-slate-300">Prévia do catálogo com barbearias fictícias. Agendamentos ainda não estão disponíveis.</p>
        {children}
      </Container>
    </div>
  )
}
