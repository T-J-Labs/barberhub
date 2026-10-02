import { adminNavigation } from "../../config/admin-navigation"
import { AuthenticatedHeader } from "./AuthenticatedHeader"

type AdminHeaderProps = {
  barbershopName?: string
  desktopNavigation?: boolean
}

export function AdminHeader({ barbershopName, desktopNavigation = false }: AdminHeaderProps) {
  return (
    <AuthenticatedHeader
      contextLabel="Barbearia atual"
      contextName={barbershopName ?? "Barbearia não identificada"}
      navigation={adminNavigation}
      desktopNavigation={desktopNavigation}
    />
  )
}
