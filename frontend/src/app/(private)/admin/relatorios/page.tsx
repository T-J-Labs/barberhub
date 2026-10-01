import { ReportsView } from "@/features/relatorios/components/ReportsView"
import { reportsMock } from "@/features/relatorios/mock-data"

export default function ReportsPage() {
  return <ReportsView appointments={reportsMock} />
}
