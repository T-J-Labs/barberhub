import { ServicesView } from "@/features/servicos/components/ServicesView"
import { servicesMock } from "@/features/servicos/mock-data"

export default function ServicesPage() {
  return <ServicesView initialServices={servicesMock} />
}
