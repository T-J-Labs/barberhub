import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { catalogActionClass } from "@/features/barbershop-catalog/styles";
import { onboardingHref } from "@/features/owner-onboarding/routing";

export function PlansSection() {
  return (
    <section
      id="preco"
      aria-labelledby="price-title"
      className="relative isolate overflow-hidden bg-[#07111C] py-12 sm:py-16"
    >
      <Container>
        <div className="relative rounded-2xl border border-sky-500/60 bg-[#0D1722] p-6 sm:p-12">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-3 rounded-l-2xl bg-sky-500"
          />
          <div className="relative ml-3 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
            <div>
              <h2 id="price-title" className="text-[2.25rem] font-bold text-white sm:text-5xl">
                Um único plano para sua barbearia
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-7 text-[#B6C2D1]">
                Sua página e sua operação em um só lugar. Por R$ 40/mês, apresente sua barbearia, organize serviços e profissionais e gerencie seus agendamentos com o BarberHub.
              </p>
              <h3 className="mt-6 text-base font-semibold text-white">Funcionalidades previstas para o MVP</h3>
              <ul className="mt-4 grid list-inside list-disc gap-3 text-slate-300 sm:grid-cols-2 marker:text-sky-400">
                {["Perfil público", "Serviços", "Equipe", "Funcionamento", "Agenda", "Agendamentos"].map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="min-w-0 border-t border-[#26384A] pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">R$ 40/mês <span className="mt-2 block text-base font-normal tracking-normal text-[#B6C2D1]">por barbearia</span></p>
              <p className="mt-6 text-sm font-medium text-sky-300">Contratação ainda indisponível</p>
              <Link href={onboardingHref()} aria-describedby="price-demo-notice" className={`${catalogActionClass} mt-4 min-h-12 w-full px-3 py-3 text-center`}>
                Experimentar configuração
              </Link>
              <p id="price-demo-notice" className="mt-4 text-sm leading-6 text-[#B6C2D1]">
                Abre uma demonstração de configuração. Não contrata um plano, cria conta ou estabelecimento, concede acesso nem publica uma barbearia.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
