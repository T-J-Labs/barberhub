import { redirect } from "next/navigation"

/** Alias legado. No subdomínio reconhecido, o proxy redireciona antes do streaming. */
export default function LegacyBookingPage() { redirect("/agendar") }
