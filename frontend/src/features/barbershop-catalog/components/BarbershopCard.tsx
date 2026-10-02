import { FiMapPin } from "react-icons/fi"
import type { BarbershopPresentation } from "../types"
import { catalogPanelClass } from "../styles"
import { BarbershopPreview } from "./BarbershopPreview"

export function BarbershopCard({ shop }: { shop: BarbershopPresentation }) {
  return (
    <li className={`${catalogPanelClass} flex min-w-0 flex-col break-words p-5 sm:p-6`}>
      <div aria-hidden="true" className="grid size-14 place-items-center rounded-lg border border-[#26384A] bg-[#172535] text-lg font-semibold text-sky-300">{shop.initials}</div>
      <h3 className="mt-4 text-xl font-semibold tracking-tight">{shop.name}</h3>
      <div className="mt-3 mb-auto flex items-start gap-2 text-sm leading-6 text-slate-300">
        <FiMapPin className="mt-1 shrink-0 text-sky-400" size={16} aria-hidden="true" />
        <p className="min-w-0">{shop.neighborhood}<span className="block text-slate-400">{shop.city}</span></p>
      </div>
      <BarbershopPreview shop={shop} />
    </li>
  )
}
