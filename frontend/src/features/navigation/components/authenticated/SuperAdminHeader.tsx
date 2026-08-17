import { superAdminNavigation } from "../../config/super-admin-navigation"
import { AuthenticatedHeader } from "./AuthenticatedHeader"

export function SuperAdminHeader() {
  return (
    <AuthenticatedHeader
      contextLabel="Acesso"
      contextName="Super Administrador"
      navigation={superAdminNavigation}
    />
  )
}
