/** Modelos de apresentação local. Não são contratos de API ou DTOs. */
export type DemoService = { key: string; name: string; description: string; price: number; durationMinutes: number }
export type DemoProfessional = { key: string; name: string; description: string; serviceKeys: string[] }
export type DemoDate = { key: string; label: string }
export type BookingDemoData = { services: DemoService[]; professionals: DemoProfessional[]; dates: DemoDate[]; slots: Record<string, string[]> }
export type BookingSelection = { service: string; professional: string; date: string; slot: string }
export type DemoScenario = "normal" | "loading" | "no-services" | "no-professionals" | "no-slots" | "error" | "invalid-review" | "final-error" | "conflict"
