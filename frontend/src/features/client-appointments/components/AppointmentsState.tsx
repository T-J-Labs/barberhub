import { catalogPanelClass } from "@/features/barbershop-catalog/styles"

// Intenção: explicar ausência/espera sem sugerir dados reais. Título lidera; paleta da conta,
// bordas sutis, superfície de catálogo, Geist 20/14px e ritmo de 4px mantêm leitura calma.
export function AppointmentsState({ kind }: { kind: "loading" | "error" | "empty" | "no-results" | "unavailable" }) {
  const content = {
    loading: ["Carregando exemplos…", "Preparando a demonstração local. Nenhuma reserva real está sendo consultada."],
    error: ["Não foi possível carregar os exemplos", "Falha de carregamento. Nenhuma reserva foi alterada."],
    empty: ["Nenhum agendamento de exemplo", "Quando a integração estiver disponível, suas reservas aparecerão aqui, identificadas por barbearia."],
    "no-results": ["Nenhum resultado para esta busca", "Tente o nome da barbearia, serviço ou profissional, ou limpe a busca."],
    unavailable: ["Demonstração indisponível neste domínio", "Abra a área do cliente no domínio principal configurado do BarberHub."],
  }[kind]
  return <section role={kind === "error" ? "alert" : "status"} aria-busy={kind === "loading"} className={`${catalogPanelClass} p-6 sm:p-8`}>
    <h2 className="text-xl font-semibold tracking-tight">{content[0]}</h2>
    <p className="mt-2 text-sm leading-6 text-slate-300">{content[1]}</p>
  </section>
}
