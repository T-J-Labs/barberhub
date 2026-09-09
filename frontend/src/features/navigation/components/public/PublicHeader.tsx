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
    <header className="bg-[#07111C] border-b border-slate-700/55 lg:border-b-0">
      <Container>
        <div className="flex items-center justify-between py-4 lg:border-b lg:border-slate-700/55">
          <button
            type="button"
            className="-my-1.5 inline-grid size-11 place-items-center rounded-md text-white lg:hidden"
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
                className="-my-1.5 inline-flex min-h-11 items-center rounded-md text-lg text-white transition-colors duration-300 hover:text-sky-500"
              >
                {item.label}
              </Link>
            ))} 
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="-my-1.5 hidden min-h-11 items-center justify-center rounded-md bg-sky-500 px-4 font-medium text-white transition duration-300 hover:scale-105 lg:inline-flex"
            >
              Entrar
            </Link>
            
            <Link
              href="/register"
              className="-my-1.5 hidden min-h-11 items-center justify-center rounded-md bg-sky-500 px-4 font-medium text-white transition duration-300 hover:scale-105 lg:inline-flex"
            >
              Registrar
            </Link>
          </div>

        </div>
      </Container>
    </header>
  )
}
