"use client"

import { ProfileShell } from "@/features/public-barbershop/components/ProfileShell"
import { ProfileState } from "@/features/public-barbershop/components/ProfileState"

export default function Error({ reset }: { reset: () => void }) {
  return <ProfileShell><ProfileState kind="error" onRetry={reset} /></ProfileShell>
}
