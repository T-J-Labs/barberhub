import { catalogActionClass, catalogFocusClass, catalogPanelClass } from "@/features/barbershop-catalog/styles"
import { fictionalOwner, originLabels } from "../fixtures"
import type { DemoOrigin } from "../types"
import type { RefObject } from "react"

// Intenção: escolher como ensaiar a abertura sem confundir aceite com identidade.
// Hierarquia: título 24/600 e escolha nativa; azul só no início, aviso junto ao
// convite. Superfície pública/bordas sutis, Geist, base 4px e painéis 24px.
export function Introduction({ origin, onChoose, onStart, headingRef }: { origin: DemoOrigin | null; onChoose: (origin: DemoOrigin) => void; onStart: () => void; headingRef: RefObject<HTMLHeadingElement | null> }) {
  return <section className={`${catalogPanelClass} mx-auto max-w-3xl p-5 sm:p-8`} aria-labelledby="intro-title">
    <h2 id="intro-title" ref={headingRef} tabIndex={-1} className={`rounded text-2xl font-semibold tracking-tight ${catalogFocusClass}`}>Prepare uma barbearia de exemplo</h2>
    <p className="mt-3 text-sm leading-6 text-slate-300">Simulação guiada de estabelecimento, endereço pretendido, um serviço, um profissional e horários. Os dados existem somente durante este fluxo e são descartados ao sair ou recarregar. Você pode interromper a qualquer momento.</p>
    <fieldset className="mt-6 space-y-3"><legend className="mb-3 font-semibold">Escolha a origem do exemplo fictício</legend>
      {(["cadastro", "superadmin"] as const).map(value => <label key={value} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border p-4 ${origin === value ? "border-sky-400 bg-sky-500/10" : "border-[#26384A]"} ${catalogFocusClass}`}><input className="size-5 shrink-0 accent-sky-500" type="radio" name="demo-origin" value={value} checked={origin === value} onChange={() => onChoose(value)} /><span className="text-sm font-medium">{originLabels[value]}</span></label>)}
    </fieldset>
    {origin && <p role="status" className="mt-4 text-sm leading-6 text-sky-300">Origem escolhida: {originLabels[origin]}. Exemplo independente.</p>}
    {origin === "superadmin" && <div className="mt-5 border-l-2 border-sky-400 pl-4"><h3 className="font-semibold">Prévia de convite · fictício</h3><p className="mt-2 text-sm leading-6 text-slate-300">Responsável fictício: {fictionalOwner}. O exemplo Pátio é independente do rascunho do superadmin; nenhum dado daquele rascunho é usado ou sincronizado.</p><p className="mt-2 text-sm leading-6 text-slate-400">Experimentar o aceite apenas inicia este ensaio. Não envia convite, valida identidade, conclui autenticação nem concede acesso.</p></div>}
    <button type="button" onClick={onStart} disabled={!origin} className={`${catalogActionClass} mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:w-auto`}>{origin === "superadmin" ? "Experimentar demonstração do aceite" : "Iniciar configuração demonstrativa"}</button>
  </section>
}
