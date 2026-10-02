import type { ReactNode } from "react"
import { PublicFooter } from "@/features/navigation/components/public/PublicFooter"
import { getPublicBarbershopOrigin } from "@/features/public-barbershop/request-origin"

export default async function BarbershopsLayout({ children }: { children: ReactNode }) {
  const platformOrigin = await getPublicBarbershopOrigin()
  return <><main>{children}</main><PublicFooter platformOrigin={platformOrigin} /></>
}
