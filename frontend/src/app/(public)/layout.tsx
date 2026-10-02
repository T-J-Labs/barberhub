import { PublicHeaderRoute } from "@/features/navigation/components/public/PublicHeaderRoute"

type PublicLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <PublicHeaderRoute />
      {children}
    </>
  )
}
