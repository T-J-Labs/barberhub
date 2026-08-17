import Link from "next/link";

export function HeaderBrand() {
  return (
    <Link href="/" className="text-2xl font-bold tracking-wider text-white">
      BARBER<span className="text-sky-500">HUB</span>
    </Link>
  )
}
