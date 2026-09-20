import { Container } from "@/components/ui/Container";

const setupSteps = [
  {
    title: "Registre e configure",
    description: "sua barbearia.",
  },
  {
    title: "Cadastre serviços, equipe",
    description: "e horários.",
  },
  {
    title: "Compartilhe sua página",
    description: "e receba agendamentos.",
  },
] as const;

const clientFlow = [
  "Serviço",
  "profissional",
  "data",
  "horário",
  "autenticação",
  "confirmação",
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      className="relative isolate overflow-hidden bg-[#07111C] py-12 sm:py-16"
    >
      <Container>
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium tracking-widest text-sky-400">
            COMO FUNCIONA
          </p>
          <h2 className="text-[2.25rem] font-bold text-white sm:text-5xl">
            Da configuração ao agendamento.
          </h2>
          <p className="max-w-2xl text-lg text-[#B6C2D1]">
            Um caminho simples para preparar a operação e receber clientes.
          </p>
        </div>

        <div className="relative mt-10">
          <div
            aria-hidden="true"
            className="absolute top-8 right-[16.667%] left-[16.667%] hidden h-px bg-slate-700 md:block"
          />

          <ol className="grid gap-8 md:grid-cols-3 md:gap-12">
            {setupSteps.map((step, index) => (
              <li
                key={step.title}
                className="relative flex items-start gap-6 md:flex-col md:items-center md:gap-0 md:text-center"
              >
                <span
                  aria-hidden="true"
                  className={`z-10 flex size-16 shrink-0 items-center justify-center rounded-full border text-lg font-semibold ${
                    index === 0
                      ? "border-sky-500 bg-sky-500 text-white"
                      : "border-sky-500 bg-[#172535] text-sky-400"
                  }`}
                >
                  {index + 1}
                </span>
                {index < setupSteps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-16 bottom-[-2rem] left-8 border-l border-dashed border-slate-700 md:hidden"
                  />
                )}
                <div className="md:mt-5">
                  <h3 className="text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-base text-slate-400">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <article className="mt-10 rounded-2xl border border-[#26384A] bg-[#0D1722] p-6">
          <h3 className="text-xs font-semibold tracking-widest text-slate-400">
            FLUXO DO CLIENTE
          </h3>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-base font-semibold text-white sm:text-xl">
            {clientFlow.map((step, index) => (
              <span key={step} className="flex items-center gap-x-3">
                {index > 0 && <span aria-hidden="true" className="text-sky-400">→</span>}
                {step}
              </span>
            ))}
          </div>
        </article>
      </Container>
    </section>
  );
}
