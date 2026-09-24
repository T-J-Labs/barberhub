import { Container } from "@/components/ui/Container"

export function AudienceSection() {
  return(
    <section
      id="audiencia"
      className="relative isolate overflow-hidden bg-[#0A1521] py-12 sm:py-16"
    >
      <Container>
        <div className="lg:flex lg:flex-col lg:items-center lg:text-center">
          <p className="text-sky-400 font-medium text-sm tracking-widest">PARA QUEM É O BARBERHUB</p>

          <ul className="mt-8 text-lg text-white flex flex-col lg:w-full lg:flex-row gap-4">
            <li className="flex flex-1 items-center gap-4 border border-slate-700/70 bg-[#0D1722] rounded-lg p-4">
              <span aria-hidden="true" className="size-3 shrink-0 rounded-full bg-sky-400" />
              Barbearias
            </li>
            <li className="flex flex-1 items-center gap-4 border border-slate-700/70 bg-[#0D1722] rounded-lg p-4">
              <span aria-hidden="true" className="size-3 shrink-0 rounded-full bg-sky-400" />
              Profissionais independentes
            </li>
            <li className="flex flex-1 items-center gap-4 border border-slate-700/70 bg-[#0D1722] rounded-lg p-4">
              <span aria-hidden="true" className="size-3 shrink-0 rounded-full bg-sky-400" />
              Pequenas barbearias
            </li>
          </ul>
        </div>
      </Container>
    </section>
  )
}