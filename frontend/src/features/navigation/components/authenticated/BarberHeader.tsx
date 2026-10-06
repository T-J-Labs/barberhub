import { barberNavigation } from "../../config/barber-navigation"
import { AuthenticatedHeader } from "./AuthenticatedHeader"

type BarberHeaderProps = {
  barbershopName?: string
}

export function BarberHeader({ barbershopName }: BarberHeaderProps) {
  return (
    <AuthenticatedHeader
      profileHref="/barbeiro/perfil"
      contextLabel="Barbearia"
      contextName={barbershopName ?? "Barbearia não identificada"}
      navigation={barberNavigation}
    />
  )
}
