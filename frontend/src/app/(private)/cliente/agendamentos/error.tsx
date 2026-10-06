"use client"

import { Container } from "@/components/ui/Container"
import { catalogSecondaryActionClass } from "@/features/barbershop-catalog/styles"
import { AppointmentsState } from "@/features/client-appointments/components/AppointmentsState"

export default function Error({ reset }: { reset: () => void }) {
  return <div className="py-8"><Container><AppointmentsState kind="error" /><button type="button" onClick={reset} className={`mt-4 ${catalogSecondaryActionClass}`}>Tentar novamente</button></Container></div>
}
