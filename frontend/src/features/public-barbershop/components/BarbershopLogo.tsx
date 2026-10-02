import Image from "next/image"
import type { PublicBarbershopPresentation } from "../types"

type Props = {
  shop: Pick<PublicBarbershopPresentation, "logoSrc" | "initials">
}

/** Logo única da hero, responsiva e com iniciais como fallback. */
export function BarbershopLogo({ shop }: Props) {
  return (
    <div aria-hidden="true" className="grid aspect-square w-36 shrink-0 place-items-center rounded-full border-2 border-[#334155] p-6 text-5xl font-bold tracking-tighter text-white outline outline-offset-8 outline-[#26384A] sm:w-48 sm:p-8 sm:text-6xl lg:w-full lg:max-w-64 lg:p-10 lg:text-7xl">
      {shop.logoSrc ? (
        <div className="relative size-full">
          <Image src={shop.logoSrc} alt="" fill sizes="(min-width: 1024px) 256px, (min-width: 640px) 192px, 144px" className="object-contain" />
        </div>
      ) : <span>{shop.initials}</span>}
    </div>
  )
}
