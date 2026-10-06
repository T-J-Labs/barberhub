import { validateOnboarding } from "./validation"
import type { OnboardingData, ReleaseScenario, Step } from "./types"
export function calculateChecklist(data: OnboardingData) {
  const issues = validateOnboarding(data)
  const items = (["Nome e localização", "Endereço válido na demonstração", "Serviço ativo, duração e preço", "Profissional associado", "Funcionamento e disponibilidade"] as const).map((label, index) => ({
    label, step: index as Step, complete: !issues.some(issue => issue.step === index), issues: issues.filter(issue => issue.step === index),
  }))
  return { items, issues, complete: issues.length === 0, count: items.filter(item => item.complete).length }
}
export function presentationState(data: OnboardingData, scenario: ReleaseScenario) {
  if (!calculateChecklist(data).complete) return "incomplete"
  return scenario === "pending" ? "pending" : "preview"
}
