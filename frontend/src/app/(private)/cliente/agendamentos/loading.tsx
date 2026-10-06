import { Container } from "@/components/ui/Container"
import { AppointmentsState } from "@/features/client-appointments/components/AppointmentsState"

export default function Loading() {
  return <div className="py-8"><Container><AppointmentsState kind="loading" /></Container></div>
}
