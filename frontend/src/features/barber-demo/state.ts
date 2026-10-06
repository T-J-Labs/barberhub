import { demoReferenceDate, demoReferenceTime, type DemoSlot } from "./demo-data"

export type DemoAction = { type: "completed" | "no-show" | "block" | "unblock"; key: string }
export const statusLabels = { scheduled: "Agendado", completed: "Concluído", "no-show": "Falta" } as const

type DemoAppointment = Extract<DemoSlot, { kind: "appointment" }>

export function formatDemoDate(date: string) {
  // O dia é uma data local, não um instante. UTC explícito evita mudar o dia
  // dependendo do fuso da máquina que renderiza ou testa a demonstração.
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${date}T12:00:00Z`))
}

function compareDemoSlots(a: DemoSlot, b: DemoSlot) {
  return a.date.localeCompare(b.date) || a.start.localeCompare(b.start)
}

export function demoHistory(slots: readonly DemoSlot[]) {
  const items = slots.filter((slot): slot is DemoAppointment => slot.kind === "appointment" && slot.status !== "scheduled")
    .sort((a, b) => compareDemoSlots(b, a))
  return {
    items,
    completed: items.filter((item) => item.status === "completed").length,
    noShow: items.filter((item) => item.status === "no-show").length,
  }
}

export function activeDemoSlots(slots: readonly DemoSlot[]) {
  return slots.filter((slot) => slot.date === demoReferenceDate && (slot.kind !== "appointment" || slot.status === "scheduled"))
}

export function nextDemoAppointment(slots: readonly DemoSlot[]) {
  return slots.filter((slot) => slot.kind === "appointment" && slot.status === "scheduled" &&
    (slot.date > demoReferenceDate || (slot.date === demoReferenceDate && slot.start >= demoReferenceTime)))
    .sort(compareDemoSlots)[0]
}

// Apenas transições da amostra: não definem regras operacionais do backend.
export function applyDemoAction(slots: readonly DemoSlot[], action: DemoAction): readonly DemoSlot[] {
  return slots.map((slot) => {
    if (slot.key !== action.key) return slot
    if (slot.kind === "appointment" && slot.status === "scheduled" && (action.type === "completed" || action.type === "no-show")) return { ...slot, status: action.type }
    if (slot.kind === "free" && action.type === "block") return { ...slot, kind: "blocked" }
    if (slot.kind === "blocked" && action.type === "unblock") return { ...slot, kind: "free" }
    return slot
  })
}
