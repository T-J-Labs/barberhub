import { Container } from "@/components/ui/Container";
import Link from "next/link";

export function PlansSection() {
  return (
    <section
      id="planos"
      className="relative isolate overflow-hidden bg-[#07111C] py-12 sm:py-16"
    >
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-sky-500/60 bg-[#0D1722] p-8 sm:p-12">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-3 rounded-l-2xl bg-sky-500"
          />
          <div className="relative ml-3 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-medium tracking-widest text-sky-400">
                PLANOS
              </p>
              <h2 className="mt-4 text-[2.25rem] font-bold text-white sm:text-5xl">
                Planos pensados para acompanhar o crescimento da sua barbearia.
              </h2>
              <p className="mt-4 text-sm text-slate-400">
                Detalhes comerciais ainda estão em definição.
              </p>
            </div>

            <Link
              href="#contato"
              className="flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white"
            >
              Conhecer os planos
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
