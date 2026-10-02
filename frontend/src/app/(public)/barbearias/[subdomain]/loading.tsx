import { ProfileShell } from "@/features/public-barbershop/components/ProfileShell"
import { ProfileState } from "@/features/public-barbershop/components/ProfileState"

export default function Loading() {
  return <ProfileShell><ProfileState kind="loading" /></ProfileShell>
}
