import Link from "next/link"
import { publicNavigation } from "../../config/public-navigation"
import { HeaderBrand } from "../HeaderBrand"

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-800/70 bg-[#030811]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-12 lg:py-16">
        <div className="max-w-sm">
          <HeaderBrand />
          <p className="mt-5 text-sm leading-6 text-slate-300">
            Gestão simples e inteligente para barbearias organizarem sua rotina,
            seus serviços e seus agendamentos.
          </p>
        </div>

        <nav aria-label="Navegação do rodapé">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Explorar
          </h2>
          <ul className="mt-4 space-y-3">
            {publicNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-slate-300 transition-colors hover:text-sky-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Acesso
          </h2>
          <div className="mt-4 flex flex-col items-start gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-300 transition-colors hover:text-sky-400"
            >
              Entrar na plataforma
            </Link>
            <Link
              href="/register"
              className="text-sm text-slate-300 transition-colors hover:text-sky-400"
            >
              Criar uma conta
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>© {new Date().getFullYear()} BarberHub. Todos os direitos reservados.</p>
          <p>Feito para simplificar a rotina da sua barbearia.</p>
        </div>
      </div>
    </footer>
  )
}