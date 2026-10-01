import { AdminSettingsView } from "@/features/admin-settings/components/AdminSettingsView"
import { barbershopSettingsMock } from "@/features/admin-settings/mock-data"

export default function AdminSettingsPage() {
  return <AdminSettingsView initialSettings={barbershopSettingsMock} />
}
