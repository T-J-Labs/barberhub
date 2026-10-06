import { ClientHeader } from "@/features/navigation/components/authenticated/ClientHeader"
import { getPlatformNavigation } from "@/features/auth/server-navigation"

import { AreaProfileProvider } from "@/features/demo-profile/components/DemoProfileProvider"

type ClientLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default async function ClientLayout({ children }: ClientLayoutProps) {
  const platform = await getPlatformNavigation()
  return (
    <AreaProfileProvider role="cliente" initialName="Cliente de demonstração">
      <ClientHeader platformOrigin={platform.origin} />
      <main>{children}</main>
    </AreaProfileProvider>
  )
}
