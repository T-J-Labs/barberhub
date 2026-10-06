import type { DemoShop } from "./mock-data"

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim()
}

export function filterShops(shops: readonly DemoShop[], query: string) {
  return shops.filter(shop => normalize(`${shop.name} ${shop.city} ${shop.neighborhood}`).includes(normalize(query)))
}

export function summarizeShops(shops: readonly DemoShop[]) {
  const active = shops.filter(shop => shop.demoStatus === "active").length
  return { total: shops.length, active, suspended: shops.length - active }
}

export function setDemoStatus(shops: readonly DemoShop[], id: string, status: DemoShop["demoStatus"]) {
  return shops.map(shop => shop.id === id ? { ...shop, demoStatus: status } : shop)
}

export function readSearch(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim().slice(0, 120) : ""
}

export function listHref(query: string) {
  return `/super-admin/barbearias${query ? `?${new URLSearchParams({ q: query })}` : ""}`
}

export function detailsHref(id: string, query: string) {
  return `/super-admin/barbearias/${encodeURIComponent(id)}${query ? `?${new URLSearchParams({ q: query })}` : ""}`
}
