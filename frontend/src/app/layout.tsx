import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { DemoClientProvider } from "@/features/auth/components/DemoClientProvider";
import { PwaRuntime } from "@/features/pwa/components/PwaRuntime";
import { getConfiguredPublicHost } from "@/features/public-barbershop/host-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = { themeColor: "#07111C" };

export const metadata: Metadata = {
  title: {
    default: "BarberHub | Gestão e agendamento para barbearias",
    template: "%s | BarberHub",
  },
  description:
    "Organize serviços, equipe e agendamentos da sua barbearia em um só lugar.",
  applicationName: "BarberHub",
  icons: { icon: "/pwa/icon-192.png", apple: "/pwa/apple-180.png" },
  keywords: [
    "gestão de barbearia",
    "agendamento para barbearia",
    "sistema para barbearia",
    "agenda online",
  ],
  openGraph: {
    title: "BarberHub | Gestão e agendamento para barbearias",
    description:
      "Organize sua barbearia e receba agendamentos online em um só lugar.",
    type: "website",
    locale: "pt_BR",
    siteName: "BarberHub",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PwaRuntime publicHost={getConfiguredPublicHost()}>
          <DemoClientProvider>{children}</DemoClientProvider>
        </PwaRuntime>
      </body>
    </html>
  );
}
