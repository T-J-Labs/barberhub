import { ProfileShell } from "@/features/public-barbershop/components/ProfileShell"
import { ProfileState } from "@/features/public-barbershop/components/ProfileState"

export default function NotFound() {
  return <ProfileShell><ProfileState kind="not-found" /></ProfileShell>
}
