import { getPlatformNavigation } from "@/features/auth/server-navigation"
import { PublicFooterContent } from "./PublicFooterContent"

export async function PublicFooter() {
  return <PublicFooterContent platform={await getPlatformNavigation()} />
}
