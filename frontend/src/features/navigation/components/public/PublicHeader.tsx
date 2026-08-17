"use client"

import Link from "next/link"
import { Container } from "@/components/ui/Container"
import { publicNavigation } from "../../config/public-navigation"
import { useState } from "react"
import { FiMenu } from "react-icons/fi"
import { HeaderBrand } from "../HeaderBrand"
import { PublicMobileMenu } from "./PublicMobileMenu"

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header>
      <Container>
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            className="text-white lg:hidden"
            aria-label="Abrir menu"
            aria-controls="public-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <FiMenu size={24} />
          </button>

          <PublicMobileMenu
            isOpen={menuOpen}
            navigation={publicNavigation}
            onClose={() => setMenuOpen(false)}
          />
          
          <HeaderBrand />

          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-8 lg:flex"
          >
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white text-lg transition-colors hover:text-sky-500 duration-300"
              >
                {item.label}
              </Link>
            ))} 
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden lg:flex rounded-md bg-sky-500 px-4 py-2 font-medium text-white hover:scale-105 transition duration-300"
            >
              Entrar
            </Link>
            
            <Link
              href="/register"
              className="hidden lg:flex rounded-md bg-sky-500 px-4 py-2 font-medium text-white hover:scale-105 transition duration-300"
            >
              Registrar
            </Link>
          </div>

        </div>
      </Container>
    </header>
  )
}
