import { isPublicSubdomain } from "@/features/public-barbershop/routing"
import { demoReservedSubdomains, registrationLimits } from "@/features/superadmin-demo/registration"
import { barbershopsMock } from "@/features/barbershop-catalog/mock-data"
import { days, type Interval, type Issue, type OnboardingData } from "./types"

export const limits = { name: registrationLimits.name, address: 160, city: registrationLimits.city, neighborhood: registrationLimits.neighborhood, subdomain: registrationLimits.subdomain, serviceName: 80, professionalName: 80 } as const
export const maxDuration = 480
export const maxPrice = 9999.99
export function normalizedSubdomain(value: string) { return value.trim().toLowerCase() }
export function minutes(value: string): number | null {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return null
  const [hours, mins] = value.split(":").map(Number)
  return hours * 60 + mins
}
export function validInterval(interval: Interval) {
  const start = minutes(interval.start), end = minutes(interval.end)
  return start !== null && end !== null && start < end
}
export function validateOnboarding(data: OnboardingData): Issue[] {
  const issues: Issue[] = []
  const add = (field: string, step: Issue["step"], message: string) => issues.push({ field, step, message })
  for (const [field, max] of Object.entries(limits) as [keyof typeof limits, number][]) {
    const step = field === "subdomain" ? 1 : field === "serviceName" ? 2 : field === "professionalName" ? 3 : 0
    if (!data[field].trim()) add(field, step, "Preencha este campo; espaços não contam.")
    else if (data[field].length > max) add(field, step, `Use até ${max} caracteres, incluindo espaços.`)
  }
  const subdomain = normalizedSubdomain(data.subdomain)
  if (!issues.some(issue => issue.field === "subdomain")) {
    if (!isPublicSubdomain(subdomain)) add("subdomain", 1, "Use letras de a a z, números e hífens internos, sem protocolo, ponto, porta, caminho ou acento.")
    else if (demoReservedSubdomains.has(subdomain) || subdomain === "onboarding" || barbershopsMock.some(shop => shop.subdomain === subdomain)) add("subdomain", 1, "Conflito com um nome da amostra local. Escolha outro para a demonstração.")
  }
  if (!/^\d{1,3}$/.test(data.duration.trim()) || Number(data.duration) < 1 || Number(data.duration) > maxDuration) add("duration", 2, `Use uma duração inteira de 1 a ${maxDuration} minutos.`)
  if (!/^\d{1,4}(?:[.,]\d{1,2})?$/.test(data.price.trim()) || Number(data.price.replace(",", ".")) > maxPrice) add("price", 2, "Use um preço de exemplo de R$ 0 a R$ 9.999,99, com até duas casas decimais.")
  if (!data.serviceActive) add("serviceActive", 2, "O serviço inicial precisa estar ativo na demonstração.")
  if (!data.serviceName.trim() || data.associatedService !== data.serviceName.trim()) add("associatedService", 3, "Associe o profissional ao serviço atual. Alterar o nome do serviço exige conferir a associação.")
  let usable = false
  for (const day of days) {
    const opening = data.opening[day], availability = data.availability[day]
    if (opening.enabled && !validInterval(opening)) add(`opening-${day}`, 4, "A abertura precisa ter início anterior ao fim (00:00 a 23:59).")
    if (!availability.enabled) continue
    if (!validInterval(availability)) { add(`availability-${day}`, 4, "A disponibilidade precisa ter início anterior ao fim (00:00 a 23:59)."); continue }
    if (!opening.enabled || !validInterval(opening) || minutes(availability.start)! < minutes(opening.start)! || minutes(availability.end)! > minutes(opening.end)!) {
      add(`availability-${day}`, 4, "O intervalo do profissional deve ficar dentro do funcionamento da barbearia neste dia.")
    } else if (issues.some(issue => issue.field === "duration") || minutes(availability.end)! - minutes(availability.start)! < Number(data.duration)) {
      add(`availability-${day}`, 4, "O intervalo precisa comportar a duração válida do serviço inicial.")
    } else usable = true
  }
  if (!usable) add("availability", 4, "Inclua ao menos um intervalo válido do profissional, dentro do funcionamento e suficiente para o serviço.")
  return issues
}
