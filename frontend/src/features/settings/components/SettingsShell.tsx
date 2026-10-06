import type { CSSProperties, ReactNode } from "react"
import { Container } from "@/components/ui/Container"

export type SettingsNavigationItem = { id: string; label: string }

type SettingsShellProps = {
  variant?: "admin" | "public"
  eyebrow: string
  title: string
  description: string
  navigation: readonly SettingsNavigationItem[]
  children: ReactNode
}

export function SettingsShell({ variant = "admin", eyebrow, title, description, navigation, children }: SettingsShellProps) {
  return (
    <div style={variant === "public" ? { "--settings-accent": "#38BDF8", "--settings-surface": "#0D1722", "--settings-hover": "#172535", "--settings-highlight": "#7DD3FC", "--settings-icon": "#172535" } as CSSProperties : undefined} className="min-h-[calc(100vh-81px)] bg-[#07111c] text-white">
      <Container>
        <div className="py-8 lg:py-12">
          <header className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--settings-accent,#65d5ff)]">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">{description}</p>
          </header>

          <div className="mt-9 grid gap-7 border-t border-slate-800/90 pt-7 lg:grid-cols-[208px_minmax(0,1fr)] lg:gap-12">
            <nav aria-label="Seções das configurações" className="min-w-0 lg:self-start lg:sticky lg:top-6">
              <p className="mb-3 hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 lg:block">Nesta página</p>
              <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                {navigation.map((item) => (
                  <li key={item.id} className="shrink-0 lg:shrink">
                    <a href={`#${item.id}`} className="flex min-h-11 items-center rounded-lg border border-slate-800 bg-[var(--settings-surface,#0b1a29)] px-3 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--settings-accent,#65d5ff)] lg:border-transparent lg:bg-transparent lg:px-2 lg:hover:bg-[var(--settings-surface,#0b1a29)]">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="min-w-0 space-y-5">{children}</div>
          </div>
        </div>
      </Container>
    </div>
  )
}

type SettingsSectionProps = SettingsNavigationItem & {
  description: string
  children: ReactNode
}

export function SettingsSection({ id, label, description, children }: SettingsSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6 overflow-hidden rounded-xl border border-slate-800 bg-[var(--settings-surface,#0b1a29)]">
      <div className="border-b border-slate-800 px-5 py-5 sm:px-7">
        <div>
          <h2 id={`${id}-title`} className="text-lg font-semibold text-white">{label}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
        </div>
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </section>
  )
}

export function SettingsField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium text-slate-200">
      <span>{label}</span>
      {children}
      {hint && <span className="text-xs font-normal leading-5 text-slate-500">{hint}</span>}
    </label>
  )
}
