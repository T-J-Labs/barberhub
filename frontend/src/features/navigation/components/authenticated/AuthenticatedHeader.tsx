"use client"

import { useState } from "react"
import { FiMenu, FiUser } from "react-icons/fi"
import { MdNotificationsNone } from "react-icons/md"
import { Container } from "@/components/ui/Container"
import type { NavigationConfig } from "../../types"
import { HeaderBrand } from "../HeaderBrand"
import { AuthenticatedMobileMenu } from "./AuthenticatedMobileMenu"

type AuthenticatedHeaderProps = {
  contextLabel?: string
  contextName?: string
  navigation: NavigationConfig
}

export function AuthenticatedHeader({
  contextLabel,
  contextName,
  navigation,
}: AuthenticatedHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header>
      <Container>
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            className="text-white"
            aria-label="Abrir menu"
            aria-controls="account-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <FiMenu size={24} />
          </button>

          <HeaderBrand />

          <div className="flex items-center gap-4">
            <button type="button" className="text-white" aria-label="Notificações">
              <MdNotificationsNone size={24} />
            </button>
            <button type="button" className="text-white" aria-label="Perfil">
              <FiUser size={24} />
            </button>
          </div>

          <AuthenticatedMobileMenu
            contextLabel={contextLabel}
            contextName={contextName}
            isOpen={menuOpen}
            navigation={navigation}
            onClose={() => setMenuOpen(false)}
          />
        </div>
      </Container>
    </header>
  )
}
