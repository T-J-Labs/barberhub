import { AdminHeader } from "@/features/navigation/components/authenticated/AdminHeader"

type AdminLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <AdminHeader />
      <main>{children}</main>
    </>
  )
}
