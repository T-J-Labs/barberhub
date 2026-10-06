import type { DemoShop } from "../mock-data"

// Estado em texto e cor: atividade verde, suspensão cinza, sem depender só da cor.
// Badge secundário, Geist 12px/500 e espaçamento de 4px seguem o sistema privado.
export function ShopStatus({ status }: { status: DemoShop["demoStatus"] }) {
  return <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${status === "active" ? "bg-emerald-400/10 text-emerald-300" : "bg-slate-700/50 text-slate-300"}`}>
    {status === "active" ? "Ativa na amostra" : "Suspensa na amostra"}
  </span>
}
