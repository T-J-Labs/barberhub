import type { ReactNode } from "react"
import Link from "next/link"
import { FiArrowUpRight } from "react-icons/fi"
import { Container } from "@/components/ui/Container"

type HelpShellProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

export function HelpShell({ eyebrow, title, description, children }: HelpShellProps) {
  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#07111c] text-white">
      <Container>
        <div className="mx-auto max-w-5xl py-8 lg:py-12">
          <header className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#65d5ff]">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">{description}</p>
          </header>
          {children}
        </div>
      </Container>
    </div>
  )
}

type HelpDestinationProps = {
  href: string
  title: string
  description: string
  icon: ReactNode
}

export function HelpDestination({ href, title, description, icon }: HelpDestinationProps) {
  return (
    <li className="border-b border-slate-800/80 last:border-b-0">
      <Link href={href} className="group flex min-h-21 items-center gap-4 rounded-lg px-3 py-4 transition-colors hover:bg-[#102235] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65d5ff] sm:px-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#12344a] text-[#8de1ff]" aria-hidden="true">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-white">{title}</span>
          <span className="mt-1 block text-xs leading-5 text-slate-400 sm:text-sm">{description}</span>
        </span>
        <FiArrowUpRight className="shrink-0 text-slate-500 transition-colors group-hover:text-[#8de1ff]" size={18} aria-hidden="true" />
      </Link>
    </li>
  )
}
