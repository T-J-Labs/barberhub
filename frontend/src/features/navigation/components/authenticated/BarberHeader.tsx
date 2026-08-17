import { barberNavigation } from "../../config/barber-navigation"
import { AuthenticatedHeader } from "./AuthenticatedHeader"

type BarberHeaderProps = {
  barbershopName?: string
}

export function BarberHeader({ barbershopName }: BarberHeaderProps) {
  return (
    <AuthenticatedHeader
      contextLabel="Barbearia"
      contextName={barbershopName ?? "Barbearia não identificada"}
      navigation={barberNavigation}
    />
  )
}
