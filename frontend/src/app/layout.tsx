import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BarberHub | Gestão e agendamento para barbearias",
    template: "%s | BarberHub",
  },
  description:
    "Organize serviços, equipe e agendamentos da sua barbearia em um só lugar.",
  applicationName: "BarberHub",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
