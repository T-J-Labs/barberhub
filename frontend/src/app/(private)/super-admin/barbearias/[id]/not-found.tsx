import Link from "next/link"
import { SuperadminShell } from "@/features/superadmin-demo/components/SuperadminShell"
import { SuperadminState } from "@/features/superadmin-demo/components/SuperadminState"
import { actionClass } from "@/features/superadmin-demo/styles"

export default function NotFound() {
  return <SuperadminShell title="Exemplo indisponível"><SuperadminState kind="missing" /><Link href="/super-admin/barbearias" className={`${actionClass} mt-6`}>Voltar à lista</Link></SuperadminShell>
}
