import { getPlatformNavigation } from "@/features/auth/server-navigation";
import { getPublicBarbershopOrigin } from "@/features/public-barbershop/request-origin";
import { institutionalLinks } from "../routing";
import { DemoImage } from "./DemoImage";
import { BookingDemo } from "./BookingDemo";
import { OperationDemo } from "./OperationDemo";
import styles from "../institutional.module.css";

function cx(names: string) {
  return names
    .split(" ")
    .map((name) => styles[name])
    .join(" ");
}

export async function InstitutionalLanding() {
  const [platform, publicOrigin] = await Promise.all([
    getPlatformNavigation(),
    getPublicBarbershopOrigin(),
  ]);
  const links = institutionalLinks(platform, publicOrigin ?? null);
  return (
    <div className={styles.theme}>
      <main id="conteudo-institucional" tabIndex={-1}>
        <section className={cx("hero")} id="inicio">
          <div className={cx("wrap hero-grid")}>
            <div className={cx("hero-copy")}>
              <h1>
                <span>
                  Sua barbearia
                  <br />
                  apresentada.
                </span>
                <span>
                  Sua agenda
                  <br />
                  organizada.
                </span>
              </h1>
              <p>
                Uma página para os clientes conhecerem sua barbearia. Um lugar
                para organizar os serviços, a equipe e os horários.
              </p>
              <a className={cx("button")} href={links.onboarding}>
                Experimentar configuração
              </a>
              <p className={cx("note")}>
                Explore a demonstração. Ela não cria conta,
                <br className={cx("desktop-only")} /> contrata um plano ou
                publica uma barbearia.
              </p>
            </div>
            <figure className={cx("hero-product")}>
              <div className={cx("figure-label")}>
                <span>Dentro do BarberHub</span>
                <strong>Agenda administrativa</strong>
              </div>
              <div className={cx("capture-stage hero-stage")}>
                <DemoImage
                  kind="agenda"
                  alt="Linha do tempo real da agenda demonstrativa, com atendimentos existentes completos da amostra de junho de 2025."
                  hero
                />
              </div>
              <figcaption>
                <span>Tela real do frontend com dados demonstrativos.</span>
                <a
                  href="/landing/agenda-full@2x.webp"
                  target="_blank"
                  rel="noopener"
                >
                  Ampliar agenda
                </a>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className={cx("presence")} id="produto">
          <span id="para-quem" aria-hidden="true"></span>
          <div className={cx("wrap presence-grid")}>
            <figure className={cx("profile-product")}>
              <div className={cx("capture-stage profile-stage")}>
                <DemoImage
                  kind="profile"
                  alt="Apresentação completa do perfil público fictício da Barbearia da Esquina, sem cortes em texto ou botões."
                />
              </div>
              <figcaption>
                Tela real do frontend com dados demonstrativos. Esquina é
                fictícia.
              </figcaption>
            </figure>
            <div className={cx("presence-copy")}>
              <h2>
                A barbearia.
                <br />
                Antes do
                <br className={cx("desktop-only")} /> agendamento.
              </h2>
              <p>
                O cliente encontra sua apresentação, os serviços, a equipe e as
                informações de visita no perfil público.
              </p>
              <p>
                É a porta de entrada para conhecer a barbearia e começar a
                escolha do horário.
              </p>
              <a
                className={cx("text-link")}
                href={links.example ?? undefined}
                aria-disabled={!links.example || undefined}
              >
                Ver exemplo de barbearia
              </a>
            </div>
          </div>
        </section>

        <section className={cx("booking")} id="agendamento-cliente">
          <div className={cx("wrap booking-grid")}>
            <div className={cx("booking-copy")}>
              <h2>
                Uma escolha
                <br />
                de cada vez.
              </h2>
              <p>
                O agendamento conduz o cliente pelas escolhas, sem perder de
                vista o serviço selecionado.
              </p>
              <ol className={cx("booking-steps")}>
                <li>Serviço</li>
                <li>Profissional</li>
                <li>Data</li>
                <li>Horário</li>
                <li>Revisão</li>
              </ol>
              <p className={cx("note")}>
                A experiência atual é demonstrativa. Datas e horários são
                exemplos; nenhum horário será reservado.
              </p>
              <a
                className={cx("text-link")}
                href={links.booking ?? undefined}
                aria-disabled={!links.booking || undefined}
              >
                Explorar agendamento demonstrativo
              </a>
            </div>
            <BookingDemo>
              <figure id="booking-service" className={cx("service-shot")}>
                <div className={cx("shot-label")}>
                  <span>1</span>
                  <strong>Escolher o serviço</strong>
                </div>
                <DemoImage
                  kind="service"
                  alt="Etapa Serviço completa, com três escolhas de exemplo e os botões Continuar e Voltar à barbearia."
                />
                <figcaption>
                  Tela real do frontend com dados demonstrativos.
                </figcaption>
              </figure>
              <figure
                id="booking-professional"
                className={cx("professional-shot")}
              >
                <div className={cx("shot-label")}>
                  <span>2</span>
                  <strong>Escolher o profissional</strong>
                </div>
                <DemoImage
                  kind="professional"
                  alt="Etapa Profissional completa após escolher Corte de cabelo, com opções reais da amostra."
                />
                <figcaption>
                  Tela real do frontend com dados demonstrativos.
                </figcaption>
              </figure>
            </BookingDemo>
          </div>
        </section>

        <section className={cx("operation")} id="servicos">
          <span id="diferenciais" aria-hidden="true"></span>
          <div className={cx("wrap")}>
            <header className={cx("operation-heading")}>
              <h2>
                A rotina tem
                <br />
                seu lugar.
              </h2>
              <p>
                Veja as telas que organizam a operação: o que a barbearia
                oferece, quem atende e quando ela funciona.
              </p>
            </header>
            <OperationDemo
              services={
                <>
                  <div className={cx("screen-context")}>
                    <h3>O catálogo, com cada serviço à vista.</h3>
                    <p>
                      Lista completa da amostra administrativa, com preço,
                      duração, situação e ações existentes.
                    </p>
                  </div>
                  <figure>
                    <DemoImage
                      kind="services"
                      alt="Catálogo administrativo completo, com quatro serviços fictícios e todas as colunas preservadas."
                    />
                    <figcaption>
                      <span>
                        Tela real do frontend com dados demonstrativos.
                      </span>
                      <a
                        href="/landing/services-1024@2x.webp"
                        target="_blank"
                        rel="noopener"
                      >
                        Ampliar tela
                      </a>
                    </figcaption>
                  </figure>
                </>
              }
              team={
                <>
                  <div className={cx("screen-context")}>
                    <h3>Os profissionais e seus dias de trabalho.</h3>
                    <p>
                      Lista completa de profissionais do exemplo administrativo,
                      sem alterações.
                    </p>
                  </div>
                  <figure>
                    <DemoImage
                      kind="team"
                      alt="Lista administrativa completa da equipe fictícia, com dias, horários, situação e ações."
                    />
                    <figcaption>
                      <span>
                        Tela real do frontend com dados demonstrativos.
                      </span>
                      <a
                        href="/landing/team-1024@2x.webp"
                        target="_blank"
                        rel="noopener"
                      >
                        Ampliar tela
                      </a>
                    </figcaption>
                  </figure>
                </>
              }
              settings={
                <>
                  <div className={cx("screen-context")}>
                    <h3>O funcionamento, de segunda a domingo.</h3>
                    <p>
                      A seção real de configuração, com todos os sete dias e os
                      intervalos de abertura.
                    </p>
                  </div>
                  <figure className={cx("hours-product")}>
                    <DemoImage
                      kind="settings"
                      alt="Seção Funcionamento completa, com os sete dias e orientação final preservados."
                    />
                    <figcaption>
                      <span>
                        Tela real do frontend com dados demonstrativos.
                      </span>
                      <a
                        href="/landing/settings-1024@2x.webp"
                        target="_blank"
                        rel="noopener"
                      >
                        Ampliar tela
                      </a>
                    </figcaption>
                  </figure>
                </>
              }
            />
            <p className={cx("independence")}>
              As amostras administrativas, o perfil público e o agendamento são
              independentes. Alterar uma demonstração não atualiza as outras.
            </p>
          </div>
        </section>

        <section className={cx("start")} id="como-funciona">
          <div className={cx("wrap start-grid")}>
            <div className={cx("start-copy")}>
              <h2>
                Um ensaio antes
                <br />
                de colocar no ar.
              </h2>
              <p>
                Experimente o onboarding existente com um exemplo de cadastro ou
                um convite fictício. Você percorre a configuração e entende o
                que falta em cada etapa.
              </p>
              <a className={cx("button")} href={links.onboarding}>
                Experimentar configuração
              </a>
              <p className={cx("note")}>
                Os dados ficam em memória e são descartados ao sair ou
                recarregar.
              </p>
            </div>
            <ol className={cx("steps")}>
              <li>
                <span className={cx("step-number")}>1</span>
                <div>
                  <h3>Configure</h3>
                  <p>
                    Nome e localização, endereço público pretendido, serviço,
                    profissional e funcionamento.
                  </p>
                </div>
              </li>
              <li>
                <span className={cx("step-number")}>2</span>
                <div>
                  <h3>Confira o checklist</h3>
                  <p>
                    Revise os requisitos mínimos e retorne às etapas que
                    precisam de ajustes.
                  </p>
                </div>
              </li>
              <li>
                <span className={cx("step-number")}>3</span>
                <div>
                  <h3>Conheça a liberação</h3>
                  <p>
                    A publicação futura exige configuração mínima e compra
                    confirmada ou liberação explícita do superadmin.
                  </p>
                </div>
              </li>
            </ol>
          </div>
          <p className={cx("wrap publication-note")}>
            Completar a demonstração não publica uma barbearia nem concede
            acesso real.
          </p>
        </section>

        <section className={cx("pricing")} id="preco">
          <div className={cx("wrap price-wrap")}>
            <h2>Um único plano para sua barbearia.</h2>
            <div className={cx("price-content")}>
              <div className={cx("price-value")}>
                <p className={cx("amount")}>
                  <span className={cx("currency")}>R$</span>40
                  <span className={cx("period")}>/mês</span>
                </p>
                <p>por barbearia</p>
              </div>
              <div className={cx("price-scope")}>
                <p>Funcionalidades previstas para o MVP</p>
                <ul className={cx("included")}>
                  <li>Perfil público</li>
                  <li>Serviços</li>
                  <li>Equipe</li>
                  <li>Funcionamento</li>
                  <li>Agenda</li>
                  <li>Agendamentos</li>
                </ul>
              </div>
            </div>
            <div className={cx("price-action")}>
              <div>
                <p className={cx("unavailable")}>
                  Contratação ainda indisponível
                </p>
                <p className={cx("note")}>
                  O preço está definido. As operações reais dependem de
                  integração.
                  <br />A demonstração não contrata um plano.
                </p>
              </div>
              <a className={cx("button")} href={links.onboarding}>
                Experimentar configuração
              </a>
            </div>
          </div>
        </section>

        <section className={cx("faq")} id="duvidas">
          <div className={cx("faq-wrap")}>
            <h2>O que você precisa saber.</h2>
            <div className={cx("questions")}>
              <details open>
                <summary>O que é o BarberHub?</summary>
                <p>
                  É um sistema para apresentar a barbearia aos clientes e
                  organizar serviços, equipe, funcionamento, agenda e
                  agendamentos. Hoje você pode conhecer suas interfaces e
                  demonstrações locais.
                </p>
              </details>
              <details>
                <summary>O que posso experimentar agora?</summary>
                <p>
                  A configuração demonstrativa e o agendamento de exemplo. As
                  telas usam dados fictícios em memória; não criam conta,
                  acesso, estabelecimento ou reserva real.
                </p>
              </details>
              <details>
                <summary>
                  Completar a configuração publica minha barbearia?
                </summary>
                <p>
                  Não. O checklist apresenta requisitos mínimos. A publicação
                  futura exige configuração e compra confirmada ou liberação
                  explícita do superadmin, além da integração ainda pendente.
                </p>
              </details>
              <details>
                <summary>Quanto custa? Já posso contratar?</summary>
                <p>
                  O plano aprovado custa R$ 40/mês por barbearia e contempla o
                  escopo previsto para o MVP apresentado nesta página.
                  Contratação ainda indisponível.
                </p>
              </details>
              <details>
                <summary>Criar conta já funciona?</summary>
                <p>
                  A ação abre a apresentação de cadastro existente. O acesso com
                  Google ainda está indisponível; escolher um perfil não cria
                  conta nem concede permissões.
                </p>
              </details>
              <details>
                <summary>O exemplo de agendamento reserva um horário?</summary>
                <p>
                  Não. Serviços, profissionais, datas e horários são
                  demonstrativos. Disponibilidade real, prevenção de conflitos e
                  reservas persistidas dependem do backend.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section className={cx("closing")} id="cta-final">
          <div className={cx("wrap closing-row")}>
            <div>
              <h2>
                Conheça por dentro.
                <br />
                Comece pela configuração.
              </h2>
              <p className={cx("note")}>
                Uma demonstração, sem contratação ou publicação real.
              </p>
            </div>
            <a className={cx("button")} href={links.onboarding}>
              Experimentar configuração
            </a>
          </div>
          <p className={cx("wrap customer-path")}>
            Procurando uma barbearia?{" "}
            <a
              className={cx("text-link")}
              href={links.catalog ?? undefined}
              aria-disabled={!links.catalog || undefined}
            >
              Explorar catálogo demonstrativo
            </a>
          </p>
        </section>
      </main>
      <footer id="contato">
        <div className={cx("wrap footer-grid")}>
          <div>
            <a className={cx("brand")} href="#inicio">
              BARBER<span>HUB</span>
            </a>
            <p>
              A apresentação da sua barbearia
              <br />e a organização da sua rotina.
            </p>
          </div>
          <nav aria-label="Produto no rodapé">
            <h2>Conheça o produto</h2>
            <a href="#produto">Produto</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#preco">Preço</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
          <nav aria-label="Acessos úteis">
            <h2>Acessos úteis</h2>
            <a
              href={links.login ?? undefined}
              aria-disabled={!links.login || undefined}
            >
              Entrar
            </a>
            <a
              href={links.ownerSignup ?? undefined}
              aria-disabled={!links.ownerSignup || undefined}
            >
              Criar conta de proprietário
            </a>
            <a
              href={links.clientSignup ?? undefined}
              aria-disabled={!links.clientSignup || undefined}
            >
              Criar conta de cliente
            </a>
            <a
              href={links.catalog ?? undefined}
              aria-disabled={!links.catalog || undefined}
            >
              Catálogo demonstrativo
            </a>
          </nav>
        </div>
        <div className={cx("wrap footer-bottom")}>
          <p>© 2026 BarberHub</p>
          <p>Produto em desenvolvimento. Demonstrações sem operações reais.</p>
        </div>
      </footer>
    </div>
  );
}
