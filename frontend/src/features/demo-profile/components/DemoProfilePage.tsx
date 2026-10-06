import Link from "next/link"
import { SettingsShell, SettingsSection } from "@/features/settings/components/SettingsShell"
import { DemoProfileForm } from "./DemoProfileForm"

export function DemoProfilePage({ role }: { role: "cliente" | "barbeiro" }) {
  return <SettingsShell variant={role === "cliente" ? "public" : "admin"} eyebrow={`Área do ${role} · demonstração`} title="Perfil demonstrativo" description="Um nome para experimentar a apresentação desta área. Nenhuma conta real é alterada." navigation={[{ id: "nome", label: "Nome de exibição" }, { id: "limites", label: "Sobre o exemplo" }]}>
    <p className="rounded-lg border border-slate-700 px-5 py-4 text-sm leading-6 text-slate-300">Alteração apenas local: recarregar ou sair desta área restaura o exemplo. Cliente e barbeiro têm estados independentes.</p>
    <SettingsSection id="nome" label="Nome de exibição" description="Edite o rascunho e aplique quando estiver pronto."><DemoProfileForm role={role} /></SettingsSection>
    <SettingsSection id="limites" label="Sobre o exemplo" description="Esta apresentação não é uma sessão autenticada.">
      <div className="space-y-3 text-sm leading-6 text-slate-400">
        <p>O acesso Google ainda está indisponível. Nome, e-mail, avatar e credenciais do Google não são alterados. A recuperação de acesso é responsabilidade do Google; não há senha local.</p>
        <p>Editar este nome não inicia a prévia do cliente, não concede papel ou permissões e não altera vínculos com barbearias nem a identidade ou titularidade dos exemplos de agendamentos e agenda.</p>
        <Link href={`/${role}/ajuda`} className="inline-flex min-h-11 items-center text-slate-200 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-sky-400">Consultar ajuda do {role}</Link>
      </div>
    </SettingsSection>
  </SettingsShell>
}
