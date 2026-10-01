export const openingDays = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"] as const

export type OpeningDay = (typeof openingDays)[number]
export type OpeningHours = { open: boolean; start: string; end: string }

export type BarbershopSettings = {
  name: string
  description: string
  email: string
  phone: string
  address: string
  city: string
  hours: Record<OpeningDay, OpeningHours>
}
