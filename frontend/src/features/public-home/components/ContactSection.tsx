import { Container } from "@/components/ui/Container";

export function ContactSection() {
  return (
    <section
      id="contato"
      className="relative isolate overflow-hidden bg-[#0A1521] py-12 sm:py-16"
    >
      <Container>
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium tracking-widest text-sky-400">
            CONTATO
          </p>
          <h2 className="text-[2.25rem] font-bold text-white sm:text-5xl">
            Fale sobre o produto.
          </h2>
          <p className="max-w-2xl text-lg text-[#B6C2D1]">
            Escolha o canal que fizer mais sentido. Os contatos definitivos
            serão publicados quando estiverem disponíveis.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-[#26384A] bg-[#0D1722] p-7">
            <p className="text-xs font-semibold tracking-widest text-sky-400">
              E-MAIL
            </p>
            <h3 className="mt-4 text-xl font-semibold text-white">
              Conversar por e-mail
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              Canal em definição — sem endereço publicado.
            </p>
          </article>

          <article className="rounded-2xl border border-[#26384A] bg-[#0D1722] p-7">
            <p className="text-xs font-semibold tracking-widest text-sky-400">
              WHATSAPP
            </p>
            <h3 className="mt-4 text-xl font-semibold text-white">
              Falar pelo WhatsApp
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              Canal em definição — sem número publicado.
            </p>
          </article>

          <article className="rounded-2xl border border-[#26384A] bg-[#0D1722] p-7">
            <p className="text-xs font-semibold tracking-widest text-sky-400">
              AJUDA
            </p>
            <h3 className="mt-4 text-xl font-semibold text-white">
              Perguntas frequentes
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              Ver perguntas frequentes →
            </p>
          </article>
        </div>
      </Container>
    </section>
  );
}
