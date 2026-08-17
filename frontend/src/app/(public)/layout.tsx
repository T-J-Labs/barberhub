import { PublicHeader } from "@/features/navigation/components/public/PublicHeader"

type PublicLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <PublicHeader />
      <main>{children}</main>
    </>
  )
}
