import { AgendaView } from "@/features/agenda/components/AgendaView"
import { agendaMock } from "@/features/agenda/mock-data"

export default async function AgendaPage({ searchParams }: { searchParams: Promise<{ novo?: string }> }) {
  const { novo } = await searchParams
  return <AgendaView data={agendaMock} initialRegisterOpen={novo === "1"} />
}
