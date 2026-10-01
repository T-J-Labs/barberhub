import type { BarbershopSettings } from "./types"

export const barbershopSettingsMock: BarbershopSettings = {
  name: "Barbearia Central",
  description: "Cortes clássicos, cuidado atual e atendimento com hora marcada.",
  email: "",
  phone: "",
  address: "",
  city: "",
  hours: {
    seg: { open: true, start: "09:00", end: "18:00" },
    ter: { open: true, start: "09:00", end: "18:00" },
    qua: { open: true, start: "09:00", end: "18:00" },
    qui: { open: true, start: "09:00", end: "18:00" },
    sex: { open: true, start: "09:00", end: "18:00" },
    sab: { open: true, start: "09:00", end: "14:00" },
    dom: { open: false, start: "09:00", end: "18:00" },
  },
}
