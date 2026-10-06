import Link from "next/link";

export function HeaderBrand({ href = "/", onNavigate }: { href?: string; onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="-my-1.5 inline-flex min-h-11 shrink-0 items-center rounded-md text-2xl font-bold tracking-wider text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
    >
      BARBER<span className="text-sky-500">HUB</span>
    </Link>
  )
}
