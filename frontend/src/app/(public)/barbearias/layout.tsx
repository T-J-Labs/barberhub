import type { ReactNode } from "react"
import { PublicFooter } from "@/features/navigation/components/public/PublicFooter"

export default function BarbershopsLayout({ children }: { children: ReactNode }) {
  return <><main>{children}</main><PublicFooter /></>
}
