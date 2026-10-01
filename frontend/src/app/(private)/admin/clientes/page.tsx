import { ClientsView } from "@/features/clientes/components/ClientsView"
import { clientsMock } from "@/features/clientes/mock-data"

export default function ClientsPage() {
  return <ClientsView data={clientsMock} />
}