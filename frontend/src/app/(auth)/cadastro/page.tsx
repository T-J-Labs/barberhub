import type { Metadata } from "next"
import { AuthScreen, type AuthPageProps } from "@/features/auth/components/AuthScreen"

export const metadata: Metadata = { title: "Criar sua conta", description: "Escolha Cliente, Barbeiro ou Barbearia para o futuro cadastro com Google no BarberHub.", robots: { index: false, follow: true } }

export default function SignupPage(props: AuthPageProps) {
  return <AuthScreen mode="cadastro" {...props} />
}
