import { adminNavigation } from "../../config/admin-navigation"
import { AuthenticatedHeader } from "./AuthenticatedHeader"

type AdminHeaderProps = {
  barbershopName?: string
}

export function AdminHeader({ barbershopName }: AdminHeaderProps) {
  return (
    <AuthenticatedHeader
      contextLabel="Barbearia atual"
      contextName={barbershopName ?? "Barbearia não identificada"}
      navigation={adminNavigation}
    />
  )
}
