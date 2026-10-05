import Link from "next/link"
import { FiHome, FiScissors, FiUser } from "react-icons/fi"
import { catalogFocusClass } from "@/features/barbershop-catalog/styles"
import { clientAuthHref, type AccountType, type AuthContext } from "../routing"

const accountTypes = [
  { value: "cliente", label: "Cliente", description: "Conhecer barbearias e usar a sua conta pessoal.", Icon: FiUser },
  { value: "barbeiro", label: "Barbeiro", description: "Atuar como profissional de uma barbearia.", Icon: FiScissors },
  { value: "barbearia", label: "Barbearia", description: "Cadastrar seu estabelecimento como proprietário.", Icon: FiHome },
] satisfies { value: AccountType; label: string; description: string; Icon: typeof FiUser }[]

export function AccountTypeOptions({ origin, context, selected }: { origin: string; context: AuthContext; selected: AccountType }) {
  return <nav aria-label="Escolha seu perfil de cadastro">
    <p className="mb-3 text-sm font-medium text-white">Quero me cadastrar como</p>
    <ul className="space-y-2">
      {accountTypes.map(({ value, label, description, Icon }) => {
        const active = selected === value
        return <li key={value}>
          <Link href={clientAuthHref(origin, "cadastro", context, value)!} scroll={false} aria-current={active ? "true" : undefined} className={`flex min-h-16 items-start gap-3 rounded-lg border p-3 transition-colors ${active ? "border-sky-400 bg-sky-500/10" : "border-[#334155] bg-[#07111C] hover:border-slate-400"} ${catalogFocusClass}`}>
            <Icon aria-hidden="true" className={`mt-1 shrink-0 ${active ? "text-sky-300" : "text-slate-400"}`} size={19} />
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-white">{label}</span><span className="mt-1 block text-xs leading-5 text-slate-300">{description}</span></span>
            {active && <span className="mt-1 text-xs text-sky-300">Escolhido</span>}
          </Link>
        </li>
      })}
    </ul>
  </nav>
}
