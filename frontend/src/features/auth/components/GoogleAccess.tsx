import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { catalogFocusClass } from "@/features/barbershop-catalog/styles"
import type { AccountType, AuthMode } from "../routing"
import { DemoHeaderPreview } from "./DemoHeaderPreview"

const profileDescriptions: Record<AccountType, { label: string; description: string }> = {
  cliente: { label: "Cliente", description: "Sua conta pessoal para conhecer barbearias. O agendamento online ainda não está disponível." },
  barbeiro: { label: "Barbeiro", description: "Seu perfil profissional. O cadastro e a vinculação a uma barbearia ainda estão em preparação." },
  barbearia: { label: "Barbearia", description: "Cadastro do estabelecimento pelo proprietário. A configuração da barbearia ainda está em preparação." },
}

export function GoogleAccess({ mode, accountType, alternateHref, returnHref, returnLabel }: {
  mode: AuthMode; accountType: AccountType; alternateHref: string; returnHref: string; returnLabel: string
}) {
  const profile = profileDescriptions[accountType]
  return <div>
    {mode === "cadastro" && <p className="mb-4 text-sm leading-6 text-[#B6C2D1]">{profile.description}</p>}
    {mode === "login" && accountType !== "cliente" && <p className="mb-4 text-sm text-slate-300">Perfil escolhido no cadastro: <strong className="text-white">{profile.label}</strong>.</p>}
    <button type="button" disabled aria-describedby="google-unavailable-note" className="flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-lg border border-slate-500 bg-[#172535] px-4 py-3 text-sm font-semibold text-slate-200">
      <FcGoogle size={22} aria-hidden="true" />{mode === "login" ? "Entrar com Google" : "Continuar com Google"}
    </button>
    <p id="google-unavailable-note" role="status" className="mt-3 text-sm leading-6 text-slate-400">Acesso com Google ainda indisponível. Esta prévia não permite criar uma conta ou entrar na plataforma.</p>
    <p className="mt-4 text-center text-sm leading-6 text-slate-300">{mode === "login" ? "Ainda não tem uma conta?" : "Já tem uma conta?"} <Link href={alternateHref} className={`inline-flex min-h-11 items-center rounded-md font-semibold text-sky-300 underline underline-offset-4 ${catalogFocusClass}`}>{mode === "login" ? "Criar conta" : "Entrar"}</Link></p>
    {accountType === "cliente" && <DemoHeaderPreview returnHref={returnHref} returnLabel={returnLabel} />}
  </div>
}
