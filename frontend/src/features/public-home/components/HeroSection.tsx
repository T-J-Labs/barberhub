import { Container } from "@/components/ui/Container";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return(
    <section
        id="inicio"
        className="relative isolate overflow-hidden bg-[#07111C] py-12 sm:py-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_88%_12%,rgba(14,165,233,0.14),transparent_26%),radial-gradient(circle_at_76%_48%,rgba(56,189,248,0.08),transparent_24%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] bg-[linear-gradient(rgba(148,163,184,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.8)_1px,transparent_1px)] bg-size-[32px_32px]"
        />

        <Container>
          <div className="mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            <div className="flex flex-col items-start justify-center gap-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/55 bg-sky-500/12 px-4 py-2">
                <span aria-hidden="true" className="size-2 rounded-full bg-sky-400" />
                <span className="text-xs font-semibold tracking-[0.12em] text-sky-300">
                  GESTÃO PARA BARBEARIAS
                </span>
              </div>
              <h1 className="text-[2.25rem] sm:text-5xl font-bold text-white">Organize sua barbearia e receba <span className="text-sky-400">agendamentos online</span></h1>
              <p className="text-lg text-[#B6C2D1]">Divulgue seus serviços, organize sua equipe e acompanhe os seus horários, tudo em um só lugar</p>

              <div className="flex flex-col items-center justify-center gap-4 lg:flex-row w-full">
                <Link
                  href="/register"
                  className="flex min-h-11 w-full items-center justify-center rounded-lg bg-sky-500 py-3 text-center text-white"
                >
                  Registrar
                </Link>
                <Link
                  href="#como-funciona"
                  className="flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-500 py-3 text-center text-slate-200"
                >
                  Como funciona
                </Link>
              </div>

              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2 whitespace-nowrap">
                  <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-sky-400" />
                  Serviços organizados
                </li>

                <li className="flex items-center gap-2 whitespace-nowrap">
                  <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-sky-400" />
                  Equipe centralizada
                </li>

                <li className="flex items-center gap-2 whitespace-nowrap">
                  <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-sky-400" />
                  Agendamentos online
                </li>
              </ul>
            </div>

            <div className="w-full max-w-152">
              <Image
                src="/images/landing/hero-dashboard-preview.svg"
                alt="Exemplo ilustrativo do painel do BarberHub"
                width={608}
                height={532}
                className="rounded-lg shadow-lg h-auto w-full"
              />
            </div>
          </div>
        </Container>


    </section>
  )
}
