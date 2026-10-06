import { calculateChecklist } from "./checklist"
import { createExample } from "./fixtures"
import type { DemoOrigin, OnboardingData, ReleaseScenario, Step } from "./types"
export type WizardState = { origin: DemoOrigin | null; phase: "intro" | "steps" | "result"; step: Step; data: OnboardingData | null; release: ReleaseScenario }
export const initialWizard: WizardState = { origin: null, phase: "intro", step: 0, data: null, release: "pending" }
export type WizardAction =
  | { type: "choose"; origin: DemoOrigin }
  | { type: "start" }
  | { type: "edit"; data: OnboardingData }
  | { type: "go"; step: Step }
  | { type: "next" }
  | { type: "release"; scenario: ReleaseScenario }
  | { type: "finish" }
  | { type: "restart" }
export function transition(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "choose": return { ...initialWizard, origin: action.origin }
    case "start": return state.origin ? { ...state, phase: "steps", step: 0, data: createExample(state.origin), release: "pending" } : state
    case "edit": return state.phase === "steps" ? { ...state, data: action.data } : state
    case "go": return state.phase === "steps" && action.step >= 0 && action.step <= 5 ? { ...state, step: action.step } : state
    case "next": return state.data && state.phase === "steps" && state.step < 5 && !calculateChecklist(state.data).issues.some(issue => issue.step === state.step) ? { ...state, step: (state.step + 1) as Step } : state
    case "release": return state.phase === "steps" ? { ...state, release: action.scenario } : state
    case "finish": return state.phase === "steps" && state.step === 5 && state.data && calculateChecklist(state.data).complete && state.release !== "pending" ? { ...state, phase: "result" } : state
    case "restart": return { ...initialWizard, origin: state.origin }
  }
}
