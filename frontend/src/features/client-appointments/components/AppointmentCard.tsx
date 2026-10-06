import { catalogFocusClass, catalogPanelClass, catalogSecondaryActionClass } from "@/features/barbershop-catalog/styles"
import { appointmentDate, appointmentTime, appointmentStatusLabel } from "../presentation"
import type { DemoAppointment } from "../types"

// Intenção: reconhecer quando e em qual barbearia. Data/hora lideram a próxima visita;
// histórico compacto. Azul de destaque, superfícies/bordas da conta, Geist e base de 4px.
export function AppointmentCard({ item, upcoming, onDetails }: { item: DemoAppointment; upcoming: boolean; onDetails: () => void }) {
  return <article className={`${catalogPanelClass} min-w-0 p-5 sm:p-6`}>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <p className={`font-semibold tabular-nums ${upcoming ? "text-xl text-white" : "text-base text-slate-300"}`}><time dateTime={item.startsAt}>{appointmentDate(item.startsAt)} · {appointmentTime(item.startsAt)}</time></p>
        <p className="mt-1 text-xs text-slate-400">Horário de Brasília · exemplo</p>
      </div>
      <span className={`rounded-md px-2 py-1 text-xs font-medium ${upcoming ? "bg-sky-500/10 text-sky-300" : "bg-[#172535] text-slate-300"}`}>{appointmentStatusLabel[item.status]}</span>
    </div>
    <h3 className="mt-5 text-lg font-semibold break-words">{item.barbershop.name}</h3>
    <p className="mt-1 text-xs break-words text-slate-400">{item.barbershop.subdomain} · {item.barbershop.location ?? "Localização não informada"}</p>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm leading-6 text-slate-300">{item.service}<span className="block text-slate-400">{item.professional ? `Com ${item.professional}` : "Profissional não informado"}</span></p>
      <button type="button" onClick={onDetails} className={`${catalogSecondaryActionClass} ${catalogFocusClass}`} aria-label={`Ver detalhes de ${item.service} em ${item.barbershop.name}, ${appointmentDate(item.startsAt)}`}>Ver detalhes</button>
    </div>
  </article>
}
