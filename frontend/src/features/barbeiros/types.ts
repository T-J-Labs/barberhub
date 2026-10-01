export const weekdays = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"] as const

export type Weekday = (typeof weekdays)[number]

export type Barber = {
  id: string
  name: string
  active: boolean
  workdays: Weekday[]
  startTime: string
  endTime: string
}
