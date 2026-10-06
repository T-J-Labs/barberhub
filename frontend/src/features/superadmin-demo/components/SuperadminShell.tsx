import { Container } from "@/components/ui/Container"
import { NavigationItems } from "@/features/navigation/components/authenticated/NavigationItems"
import { superAdminNavigation } from "@/features/navigation/config/super-admin-navigation"
import { panelClass } from "../styles"
import { DemoScenarios } from "./DemoScenarios"

// Intenção: operador global encontra estabelecimentos, em uma interface sóbria.
// Hierarquia: tarefa em 30/36px, lista como foco; resumo secundário e aviso sempre visível.
// Paleta/superfícies: sistema privado (#07111c, #0b1a29, #102235, #65d5ff, #8de1ff),
// com branco e slate de apoio; profundidade por bordas. Geist, base 4px, painéis 24px.
export function SuperadminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="py-7 lg:py-10" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}><Container>
    <div className="mx-auto max-w-5xl">
      <header className="mb-6"><p className="text-sm font-medium text-[#8de1ff]">Superadmin · demonstração local</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      </header>
      <nav aria-label="Superadmin" className="mb-6"><ul className="flex flex-wrap gap-3 text-sm"><NavigationItems items={superAdminNavigation.primary.filter(item => "href" in item)} /></ul></nav>
      <aside aria-label="Limites da demonstração" className={`${panelClass} mb-6 p-5 text-sm leading-6 text-slate-300`}>
        <p className="font-semibold text-[#8de1ff]">Amostra fictícia · nenhuma operação real</p>
        <p className="mt-2">Cadastrar, suspender e reativar alteram somente a amostra em memória. Nada é salvo ou aplicado a uma barbearia real. Nenhuma compra, acesso, publicação ou subdomínio é provisionado. Recarregar ou sair desta área restaura os exemplos e remove os rascunhos.</p>
        <p className="mt-2 text-slate-400">Catálogo, publicação e acesso não são alterados. Esta rota e o header não representam autenticação ou autorização.</p>
      </aside>
      {process.env.NODE_ENV === "development" && <DemoScenarios />}
      {children}
    </div>
  </Container></div>
}
