import type { Metadata } from "next"
import { SuperadminHelpPage } from "@/features/superadmin-demo/components/SuperadminHelpPage"

export const metadata: Metadata = {
  title: "Ajuda do superadmin — demonstração",
  description: "Guia das ações existentes e dos limites da demonstração do superadmin.",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <SuperadminHelpPage />
}
