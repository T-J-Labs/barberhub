import { AdminDashboard } from "@/features/admin-dashboard/components/AdminDashboard"
import { adminDashboardMock } from "@/features/admin-dashboard/mock-data"

export default function AdminPage() {
  return <AdminDashboard data={adminDashboardMock} />
}
