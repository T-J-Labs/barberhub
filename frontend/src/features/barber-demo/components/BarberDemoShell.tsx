import { AppliedDemoName } from "@/features/demo-profile/components/AppliedDemoName"
import { Container } from "@/components/ui/Container"
import { demoShop } from "../demo-data"
import { panelClass } from "../styles"

// Intenção: profissional entre atendimentos. Título identifica a tarefa; horários lideram
// a view. Paleta privada, profundidade por bordas, superfície #0b1a29 sobre #07111c,
// Geist 30/14px e base de 4px com seções de 32px preservam a leitura rápida no celular.
export function BarberDemoShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="py-7 lg:py-10" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}><Container><div className="mx-auto max-w-5xl">
    <header className="mb-6"><p className="text-sm font-medium text-[#8de1ff]">Área do barbeiro · demonstração</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1><p className="mt-3 text-sm leading-6 text-slate-400 [overflow-wrap:anywhere]"><AppliedDemoName /> · {demoShop}</p></header>
    <aside aria-label="Limites da demonstração" className={`${panelClass} mb-8 p-5 text-sm leading-6 text-slate-300`}>
      <p className="font-semibold text-[#8de1ff]">Dados fictícios · nenhuma agenda real</p>
      <p className="mt-2">Conclusão, falta e bloqueios alteram apenas os exemplos em memória. Nada é salvo. Recarregar ou sair desta área restaura a amostra.</p>
      <p className="mt-2 text-slate-400">Não há sessão autenticada, vínculo aprovado ou autorização. “Minha agenda” mostra somente a fixture de um profissional; essa restrição visual e o header não protegem dados.</p>
    </aside>
    {children}
  </div></Container></div>
}
