import { clientNavigation } from "../../config/client-navigation"
import { AuthenticatedHeader } from "./AuthenticatedHeader"

export function ClientHeader() {
  return <AuthenticatedHeader navigation={clientNavigation} />
}
