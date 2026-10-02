import Link from "next/link"
import { FiAlertCircle, FiMapPin, FiSearch } from "react-icons/fi"
import { catalogActionClass, catalogPanelClass } from "../styles"

type CatalogStateProps = { kind: "loading" | "empty" | "no-results" | "error"; onRetry?: () => void }

const messages = {
  empty: { icon: FiMapPin, title: "Nenhuma barbearia por aqui ainda", description: "Os estabelecimentos aparecerão aqui quando estiverem disponíveis no catálogo." },
  "no-results": { icon: FiSearch, title: "Nenhuma barbearia encontrada", description: "Confira o nome ou tente outra cidade ou bairro. Você também pode limpar os filtros." },
  error: { icon: FiAlertCircle, title: "Não foi possível carregar as barbearias", description: "Tente carregar o catálogo novamente para continuar sua busca." },
}

export function CatalogState({ kind, onRetry }: CatalogStateProps) {
  if (kind === "loading") return (
    <section aria-label="Carregando catálogo" aria-busy="true" className="mt-8">
      <p role="status" className="text-sm text-slate-300">Carregando barbearias…</p>
      <div aria-hidden="true" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((id) => (
          <div key={id} className={`${catalogPanelClass} p-5 motion-safe:animate-pulse`}>
            <div className="size-14 rounded-lg bg-[#172535]" />
            <div className="mt-5 h-5 w-3/4 rounded bg-[#172535]" />
            <div className="mt-3 h-4 w-1/2 rounded bg-[#172535]" />
            <div className="mt-7 h-11 rounded-lg bg-[#172535]" />
          </div>
        ))}
      </div>
    </section>
  )

  const { icon: Icon, title, description } = messages[kind]
  return (
    <div role={kind === "error" ? "alert" : "status"} className={`${catalogPanelClass} flex min-h-72 flex-col items-center justify-center p-6 text-center`}>
      <Icon size={28} className="text-sky-400" aria-hidden="true" />
      <h3 className="mt-4 text-xl font-semibold text-balance">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
      {kind === "no-results" && <Link href="/barbearias" className={`mt-5 ${catalogActionClass}`}>Limpar filtros</Link>}
      {kind === "error" && (onRetry
        ? <button type="button" onClick={onRetry} className={`mt-5 ${catalogActionClass}`}>Tentar novamente</button>
        : <Link href="/barbearias" className={`mt-5 ${catalogActionClass}`}>Tentar novamente</Link>)}
    </div>
  )
}
