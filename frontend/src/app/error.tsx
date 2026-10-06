"use client"

import { LoadRecovery } from "@/features/pwa/components/LoadRecovery"

export default function Error({ reset }: { reset: () => void }) {
  return <LoadRecovery reset={reset} />
}
