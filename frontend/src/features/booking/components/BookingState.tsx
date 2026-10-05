import Link from "next/link"
import { Container } from "@/components/ui/Container"
import { catalogFocusClass, catalogPanelClass } from "@/features/barbershop-catalog/styles"

// Estado público seguro: a escolha da barbearia lidera; mesmos tokens, Geist e ritmo do perfil.
export function BookingState({ loading = false, catalogHref = "/barbearias" }: { loading?: boolean; catalogHref?: string }) {
  return <div className="py-8 sm:py-12"><Container><section className={`${catalogPanelClass} mx-auto max-w-2xl p-5 sm:p-8`}>
    <h1 className="text-2xl font-semibold tracking-tight">{loading ? "Carregando demonstração de agendamento…" : "Escolha uma barbearia para começar"}</h1>
    <p role="status" className="mt-3 text-sm leading-6 text-slate-300">{loading ? "Preparando a experiência local. Nenhuma disponibilidade real está sendo consultada." : "O contexto público não foi reconhecido. Abra o perfil de uma barbearia no catálogo; parâmetros de consulta não selecionam um estabelecimento."}</p>
    {!loading && <Link href={catalogHref} className={`mt-4 inline-flex min-h-11 items-center rounded-md text-sm text-sky-300 underline underline-offset-4 ${catalogFocusClass}`}>Explorar barbearias</Link>}
  </section></Container></div>
}
