import { ClientHeader } from "@/features/navigation/components/authenticated/ClientHeader"

type ClientLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <ClientHeader />
      <main>{children}</main>
    </>
  )
}
