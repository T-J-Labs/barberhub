import Link from "next/link";

export function HeaderBrand() {
  return (
    <Link
      href="/"
      className="-my-1.5 inline-flex min-h-11 items-center rounded-md text-2xl font-bold tracking-wider text-white"
    >
      BARBER<span className="text-sky-500">HUB</span>
    </Link>
  )
}
