"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { NavigationItem } from "../../types"

type NavigationItemsProps = {
  items: readonly NavigationItem[]
  onNavigate?: () => void
}

export function NavigationItems({ items, onNavigate }: NavigationItemsProps) {
  const pathname = usePathname()

  return items.map((item) => {
    // The role's home must not be selected along with every descendant route.
    const active = item.href !== undefined && (pathname === item.href ||
      (item.href.split("/").filter(Boolean).length > 1 && pathname.startsWith(`${item.href}/`)))

    return (
      <li key={item.label}>
        {item.href ? (
          <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center rounded-lg px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65d5ff] ${active ? "bg-[#12344a] text-[#8de1ff]" : "hover:bg-[#102235]"}`}
          >
            {item.label}
          </Link>
        ) : (
          <span className="flex min-h-11 cursor-not-allowed items-center px-2 text-slate-500" aria-disabled="true">
            {item.label}
          </span>
        )}
      </li>
    )
  })
}
