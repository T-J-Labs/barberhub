import { BarbersView } from "@/features/barbeiros/components/BarbersView"
import { barbersMock } from "@/features/barbeiros/mock-data"
import { AdminDemoNotice, type DemoSearchParams } from "@/features/owner-onboarding/components/AdminDemoNotice"

export default function BarbersPage({ searchParams }: DemoSearchParams) {
  return <><AdminDemoNotice searchParams={searchParams} /><BarbersView initialBarbers={barbersMock} /></>
}
