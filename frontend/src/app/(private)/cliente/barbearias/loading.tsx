import { Container } from "@/components/ui/Container"
import { ClientBarbershopsState } from "@/features/client-barbershops/components/ClientBarbershopsState"

export default function Loading() { return <div className="py-8"><Container><ClientBarbershopsState kind="loading" /></Container></div> }
