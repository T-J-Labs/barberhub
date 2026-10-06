"use client"

import Link from "next/link"
import { useState } from "react"
import { FiUser } from "react-icons/fi"
import { MdNotificationsNone } from "react-icons/md"
import { DemoDialog } from "@/features/demo-ui/components/DemoDialog"
import { menuControlClass } from "./styles"

type Props = {
  profileHref?: string
  onProfile?: () => void
  notificationDescription?: string
}

/** Controles de apresentação; notificações e sessão reais seguem indisponíveis. */
export function HeaderAccountActions({ profileHref, onProfile, notificationDescription = "Prévia das atualizações da sua conta." }: Props) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  return <>
    <div className="flex shrink-0 items-center gap-1 sm:gap-3">
      <button type="button" className={menuControlClass} aria-label="Notificações" aria-haspopup="dialog" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen(true)}>
        <MdNotificationsNone size={24} aria-hidden="true" />
      </button>
      {profileHref ? <Link href={profileHref} aria-label="Perfil" className={menuControlClass}><FiUser size={24} aria-hidden="true" /></Link> :
        <button type="button" className={menuControlClass} aria-label="Perfil" onClick={onProfile}><FiUser size={24} aria-hidden="true" /></button>}
    </div>
    <DemoDialog open={notificationsOpen} onClose={() => setNotificationsOpen(false)} title="Notificações" description={notificationDescription}>
      <p className="rounded-lg border border-slate-800 bg-[#07111c] px-4 py-5 text-sm leading-6 text-slate-400">Nenhuma notificação nesta demonstração. Novos avisos aparecerão aqui quando a plataforma estiver integrada.</p>
    </DemoDialog>
  </>
}
