import Link from "next/link"
import { catalogPanelClass, catalogActionClass } from "@/features/barbershop-catalog/styles"

// Cliente retornando à sua barbearia; título 20px lidera, corpo 14px, Geist herdada,
// paleta pública e borda sutil dão continuidade à conta. Ritmo 4px, padding 24/32px.
export function ClientBarbershopsState({ kind }: { kind: "empty" | "loading" | "error" | "unavailable" }) {
  const [title, description] = {
    empty: ["Nenhuma barbearia de exemplo", "O vínculo real nasce após o primeiro agendamento real confirmado na barbearia. Explore os estabelecimentos para conhecer seus serviços; experimentar o wizard não cria vínculo."],
    loading: ["Carregando barbearias de exemplo…", "Preparando vínculos fictícios. Nenhum dado privado está sendo consultado."],
    error: ["Não foi possível carregar as barbearias de exemplo", "Nenhum vínculo foi alterado. Tente carregar os exemplos novamente."],
    unavailable: ["Demonstração indisponível neste domínio", "Abra Minhas barbearias no domínio principal configurado do BarberHub."],
  }[kind]
  return <section role={kind === "error" ? "alert" : "status"} aria-busy={kind === "loading"} className={`${catalogPanelClass} p-6 sm:p-8`}>
    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    {kind === "empty" && <Link href="/barbearias" className={`mt-5 ${catalogActionClass}`}>Explorar barbearias</Link>}
  </section>
}
