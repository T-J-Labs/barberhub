import { AdminSettingsView } from "@/features/admin-settings/components/AdminSettingsView"
import { barbershopSettingsMock } from "@/features/admin-settings/mock-data"
import { AdminDemoNotice, type DemoSearchParams } from "@/features/owner-onboarding/components/AdminDemoNotice"

export default function AdminSettingsPage({ searchParams }: DemoSearchParams) {
  return <><AdminDemoNotice searchParams={searchParams} /><AdminSettingsView initialSettings={barbershopSettingsMock} /></>
}
