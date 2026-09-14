import { Container } from "@/components/ui/Container";
import Image from "next/image";
import { LuCalendarDays, LuUsersRound } from "react-icons/lu";

export function ProductSection() {
  return(
    <section
        id="produto"
        className="relative isolate overflow-hidden bg-[#07111C] py-10 sm:py-12"
    >

        <Container>
          <div className="grid items-center justify-center gap-4 lg:grid-cols-[5fr_7fr] lg:gap-12">

            <div className="flex flex-col items-start justify-center gap-6">
              <p className="text-sky-400 font-medium text-sm tracking-widest">PRODUTO</p>
              <h2 className="text-[2.25rem] sm:text-5xl font-bold text-white">Administração em um único lugar</h2>
              <p className="text-lg text-[#B6C2D1]">O BarberHub reúne a rotina da barbearia em uma experiência simples para o proprietário e o cliente.</p>

              <div className="flex flex-col items-center justify-center gap-4 w-full">

                <article
                  className="flex  w-full items-center rounded-lg border border-slate-700/70 bg-[#0D1722] py-4 px-3 gap-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-500/15">
                    <LuUsersRound aria-hidden="true" className="size-5 text-sky-400" />
                  </span>
                  <div className="flex flex-col items-start justify-center">
                    <h3 className="text-lg text-white font-medium">Organização da equipe e da agenda</h3>
                    <p className="text-sm text-slate-400">Uma visão compartilhada da operação diária</p>
                  </div>
                </article>
                
                <article
                  className="flex  w-full items-center rounded-lg border border-slate-700/70 bg-[#0D1722] py-4 px-3 gap-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-500/15">
                    <LuCalendarDays aria-hidden="true" className="size-5 text-sky-400" />
                  </span>
                  <div className="flex flex-col items-start justify-center">
                    <h3 className="text-lg text-white font-medium">Experiência direta para cada pessoa</h3>
                    <p className="text-sm text-slate-400">Menos etapas para escolher e organizar horários</p>
                  </div>
                </article>

              </div> {/* FIM DOS CARDS */}

            </div>

            <div className="w-full max-w-175 justify-self-center lg:justify-self-end">
              <Image
                src="/images/landing/product-dashboard-preview.svg"
                alt="Exemplo ilustrativo da agenda, serviços e equipe no BarberHub"
                width={700}
                height={612}
                className="rounded-lg shadow-lg h-auto w-full"
              />
            </div>

          </div>
        </Container>

    </section>
  )
}
