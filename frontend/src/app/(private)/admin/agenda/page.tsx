import { AgendaView } from "@/features/agenda/components/AgendaView"
import { agendaMock } from "@/features/agenda/mock-data"

export default function AgendaPage() {
  return <AgendaView data={agendaMock} />
}