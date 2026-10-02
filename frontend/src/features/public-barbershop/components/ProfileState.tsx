import Link from "next/link"
import { FiAlertCircle, FiMapPin } from "react-icons/fi"
import { profileActionClass, profilePanelClass, profileSecondaryActionClass } from "../styles"
import { PublicCatalogLink } from "./PublicCatalogLink"

type Props = { kind: "loading" | "not-found" | "error"; onRetry?: () => void; retryHref?: string }

export function ProfileState({ kind, onRetry, retryHref }: Props) {
  if (kind === "loading") return (
    <section aria-label="Carregando barbearia" aria-busy="true">
      <p role="status" className="mb-4 text-sm text-slate-300">Carregando barbearia…</p>
      <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
        <div className={`${profilePanelClass} grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_280px]`}>
          <div><div className="h-12 w-3/4 rounded bg-[#172535]" /><div className="mt-5 h-6 w-1/2 rounded bg-[#172535]" /><div className="mt-6 h-20 rounded bg-[#172535]" /><div className="mt-8 h-12 w-48 rounded bg-[#172535]" /></div>
          <div className="hidden h-60 rounded-lg bg-[#172535] lg:block" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]"><div className={`${profilePanelClass} h-80`} /><div className={`${profilePanelClass} h-64`} /></div>
      </div>
    </section>
  )
  const missing = kind === "not-found"
  const Icon = missing ? FiMapPin : FiAlertCircle
  return (
    <section role={missing ? "status" : "alert"} className={`${profilePanelClass} flex min-h-96 flex-col items-center justify-center px-6 py-12 text-center`}>
      <Icon size={32} aria-hidden="true" className="text-sky-400" />
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-balance">{missing ? "Barbearia não encontrada" : "Não foi possível carregar esta barbearia"}</h1>
      <p className="mt-3 max-w-md text-base leading-7 text-[#B6C2D1]">{missing ? "Este endereço não corresponde a uma barbearia disponível. Confira o link ou encontre outro estabelecimento no catálogo." : "Tente novamente para consultar as informações. Você também pode voltar ao catálogo."}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {!missing && (onRetry
          ? <button type="button" onClick={onRetry} className={`${profileActionClass} cursor-pointer`}>Tentar novamente</button>
          : retryHref && <Link href={retryHref} className={profileActionClass}>Tentar novamente</Link>)}
        <PublicCatalogLink className={profileSecondaryActionClass}>Explorar barbearias</PublicCatalogLink>
      </div>
    </section>
  )
}
