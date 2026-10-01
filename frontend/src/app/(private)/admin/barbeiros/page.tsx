import { BarbersView } from "@/features/barbeiros/components/BarbersView"
import { barbersMock } from "@/features/barbeiros/mock-data"

export default function BarbersPage() {
  return <BarbersView initialBarbers={barbersMock} />
}
