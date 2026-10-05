import type { Metadata } from "next"
import { AuthScreen, type AuthPageProps } from "@/features/auth/components/AuthScreen"

export const metadata: Metadata = { title: "Entrar — conta BarberHub", description: "Prévia de acesso à conta BarberHub somente com Google.", robots: { index: false, follow: true } }

export default function LoginPage(props: AuthPageProps) {
  return <AuthScreen mode="login" {...props} />
}
