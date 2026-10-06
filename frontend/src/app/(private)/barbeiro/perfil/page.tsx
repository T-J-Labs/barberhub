import type { Metadata } from "next"
import { DemoProfilePage } from "@/features/demo-profile/components/DemoProfilePage"

export const metadata: Metadata = {
  title: "Perfil do barbeiro — demonstração",
  robots: { index: false, follow: false },
}

export default function Page() { return <DemoProfilePage role="barbeiro" /> }
