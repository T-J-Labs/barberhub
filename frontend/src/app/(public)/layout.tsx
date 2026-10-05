import { PublicHeaderRoute } from "@/features/navigation/components/public/PublicHeaderRoute"
import { getPlatformNavigation } from "@/features/auth/server-navigation"

type PublicLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const platform = await getPlatformNavigation()
  return (
    <>
      <PublicHeaderRoute platform={platform} />
      {children}
    </>
  )
}
