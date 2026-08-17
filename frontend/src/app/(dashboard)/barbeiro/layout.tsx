import { BarberHeader } from "@/features/navigation/components/authenticated/BarberHeader"

type BarberLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function BarberLayout({ children }: BarberLayoutProps) {
  return (
    <>
      <BarberHeader />
      <main>{children}</main>
    </>
  )
}
