import { ServicesView } from "@/features/servicos/components/ServicesView"
import { servicesMock } from "@/features/servicos/mock-data"
import { AdminDemoNotice, type DemoSearchParams } from "@/features/owner-onboarding/components/AdminDemoNotice"

export default function ServicesPage({ searchParams }: DemoSearchParams) {
  return <><AdminDemoNotice searchParams={searchParams} /><ServicesView initialServices={servicesMock} /></>
}
