import { SuperAdminHeader } from "@/features/navigation/components/authenticated/SuperAdminHeader"

type SuperAdminLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <>
      <SuperAdminHeader />
      <main>{children}</main>
    </>
  )
}
