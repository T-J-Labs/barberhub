import { Container } from "@/components/ui/Container";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return(
    <section
        id="inicio"
        className="relative isolate overflow-hidden bg-[#07111C] min-h-screen py-8 sm:py-24 lg:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_88%_12%,rgba(14,165,233,0.14),transparent_26%),radial-gradient(circle_at_76%_48%,rgba(56,189,248,0.08),transparent_24%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] [background-image:linear-gradient(rgba(148,163,184,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.8)_1px,transparent_1px)] [background-size:32px_32px]"
        />

        <Container>
          <div className="mx-auto flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center gap-6">
              <h1 className="text-5xl font-bold text-white">Organize sua barbearia e receba <span className="text-sky-400">agendamentos online</span></h1>
              <p className="text-lg text-[#B6C2D1]">Divulgue seus serviços, organize sua equipe e acompanhe os seus horários, tudo em um só lugar</p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row w-full">
                <Link href="/register" className="bg-sky-500 w-full text-center py-3 rounded-lg">
                  Registrar
                </Link>
                <Link href="#como-funciona" className="text-slate-200 w-full text-center py-3 border-slate-500 border rounded-lg">
                  Como funciona
                </Link>
              </div>
            </div>

            <div>
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