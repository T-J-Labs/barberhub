import { ClientHeader } from "@/features/navigation/components/authenticated/ClientHeader"
import { getPlatformNavigation } from "@/features/auth/server-navigation"

type ClientLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default async function ClientLayout({ children }: ClientLayoutProps) {
  const platform = await getPlatformNavigation()
  return (
    <>
      <ClientHeader platformOrigin={platform.origin} />
      <main>{children}</main>
    </>
  )
}
