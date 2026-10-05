import Link from "next/link"
import { FiCalendar } from "react-icons/fi"
import { profileActionClass } from "@/features/public-barbershop/styles"

// Intenção: cliente explorando uma barbearia. Foco na ação; Geist, azul e bordas do perfil,
// superfície herdada, ritmo de 4px e alvo de 48px mantêm a hierarquia pública existente.
export function BookingEntry({ bookingHref }: { bookingHref: string | null }) {
  return <div>
    {bookingHref ? <Link href={bookingHref} aria-describedby="booking-preview-note" className={profileActionClass}><FiCalendar size={18} aria-hidden="true" />Agendar horário</Link>
      : <p className="text-sm text-slate-400">Agendamento indisponível neste domínio.</p>}
  </div>
}
