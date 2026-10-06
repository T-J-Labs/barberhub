import { SuperadminShell } from "@/features/superadmin-demo/components/SuperadminShell"
import { SuperadminState } from "@/features/superadmin-demo/components/SuperadminState"

export default function Loading() {
  return <SuperadminShell title="Superadmin"><SuperadminState kind="loading" /></SuperadminShell>
}
