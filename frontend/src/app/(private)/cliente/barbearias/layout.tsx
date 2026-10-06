import { redirectClientArea } from "@/features/client-barbershops/server-domain"

export default async function ClientBarbershopsLayout({ children }: { children: React.ReactNode }) {
  await redirectClientArea("/cliente/barbearias")
  return children
}
