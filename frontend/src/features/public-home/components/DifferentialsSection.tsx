import { Container } from "@/components/ui/Container";

const differentials = [
  "Otimizado para celulares",
  "Página própria para cada barbearia",
  "Sem conflito de horários",
  "Jornadas e folgas organizadas",
  "Compartilhamento pelo WhatsApp",
] as const;

export function DifferentialsSection() {
  return (
    <section
      id="diferenciais"
      className="relative isolate overflow-hidden bg-[#0A1521] py-12 sm:py-16"
    >
      <Container>
        <div className="flex flex-col gap-4 lg:items-center lg:text-center">
          <p className="text-sm font-medium tracking-widest text-sky-400">
            DIFERENCIAIS
          </p>
          <h2 className="text-[2.25rem] font-bold text-white sm:text-5xl">
            Benefícios concretos para a rotina.
          </h2>
        </div>

        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {differentials.map((differential, index) => (
            <li
              key={differential}
              className="flex min-h-14 items-center gap-4 rounded-xl border border-[#26384A] bg-[#0D1722] px-5 py-4 lg:min-h-38 lg:flex-col lg:items-start lg:justify-between lg:p-6"
            >
              <span className="text-xl font-medium text-sky-400 lg:text-2xl">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-semibold text-white lg:text-lg">
                {differential}
              </h3>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
