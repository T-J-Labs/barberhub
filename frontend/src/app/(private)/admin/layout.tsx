import { AdminHeader } from "@/features/navigation/components/authenticated/AdminHeader"
import { AdminSidebar } from "@/features/navigation/components/authenticated/AdminSidebar"

type AdminLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <AdminHeader desktopNavigation />
      <div className="flex flex-1 admin:grid admin:grid-cols-[240px_minmax(0,1fr)]">
        <AdminSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  )
}
