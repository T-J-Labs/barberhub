import { BarberHeader } from "@/features/navigation/components/authenticated/BarberHeader"
import { BarberDemoProvider } from "@/features/barber-demo/components/BarberDemoProvider"
import { demoShop } from "@/features/barber-demo/demo-data"

import { AreaProfileProvider } from "@/features/demo-profile/components/DemoProfileProvider"
import { demoProfessional } from "@/features/barber-demo/demo-data"

type BarberLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function BarberLayout({ children }: BarberLayoutProps) {
  return (
    <AreaProfileProvider role="barbeiro" initialName={demoProfessional}><BarberDemoProvider>
      <BarberHeader barbershopName={demoShop} />
      <main>{children}</main>
    </BarberDemoProvider></AreaProfileProvider>
  )
}
