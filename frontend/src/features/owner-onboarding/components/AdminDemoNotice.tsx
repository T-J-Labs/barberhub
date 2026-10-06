import { Container } from "@/components/ui/Container"
export type DemoSearchParams = { searchParams: Promise<Record<string, string | string[] | undefined>> }
// Aviso ao chegar, sem tocar nos providers, fixtures ou CRUDs administrativos.
// Hierarquia: mensagem 14px junto ao destino, superfície existente, sem ação;
// borda sky discreta e Geist herdada, ritmo 4px/16px.
export async function AdminDemoNotice({ searchParams }: DemoSearchParams) {
  if ((await searchParams).origem !== "onboarding-demo") return null
  return <Container><p role="status" className="mt-6 rounded-lg border border-sky-400/30 p-4 text-sm leading-6 text-slate-300">Demonstração administrativa com dados independentes do onboarding. A configuração do ensaio foi descartada ao sair; nenhum dado foi transferido, e este atalho não concede acesso real.</p></Container>
}
