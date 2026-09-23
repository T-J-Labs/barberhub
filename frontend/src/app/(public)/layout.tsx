import { PublicHeader } from "@/features/navigation/components/public/PublicHeader"
import { PublicFooter } from "@/features/navigation/components/public/PublicFooter"

type PublicLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </>
  )
}
