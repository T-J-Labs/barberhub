"use client"
import { SuperadminState } from "@/features/superadmin-demo/components/SuperadminState"

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="mx-auto max-w-5xl px-4 py-8"><h1 className="mb-6 text-3xl font-semibold">Superadmin · demonstração</h1><SuperadminState kind="error" onRetry={reset} /></div>
}
