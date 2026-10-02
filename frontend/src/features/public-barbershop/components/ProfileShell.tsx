import Link from "next/link"
import type { ReactNode } from "react"
import { FiArrowLeft } from "react-icons/fi"
import { Container } from "@/components/ui/Container"
import { profileFocusClass } from "../styles"

export function ProfileShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#07111C] pb-12 text-white sm:pb-16" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
      <Container>
        <Link href="/barbearias" className={`my-4 inline-flex min-h-11 items-center gap-2 rounded-md text-sm text-slate-300 hover:text-white ${profileFocusClass}`}>
          <FiArrowLeft aria-hidden="true" /> Todas as barbearias
        </Link>
        {children}
      </Container>
    </div>
  )
}
