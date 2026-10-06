import { SuperAdminHeader } from "@/features/navigation/components/authenticated/SuperAdminHeader"
import type { Metadata } from "next"
import { SuperadminProvider } from "@/features/superadmin-demo/components/SuperadminProvider"

export const metadata: Metadata = { title: "Superadmin demonstrativo", robots: { index: false, follow: false } }

type SuperAdminLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <SuperadminProvider>
      <SuperAdminHeader />
      <main>{children}</main>
    </SuperadminProvider>
  )
}
