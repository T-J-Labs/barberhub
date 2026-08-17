export type NavigationItem = {
  label: string
}

export type NavigationConfig = {
  primary: readonly NavigationItem[]
  secondary: readonly NavigationItem[]
}

export type PublicNavigationItem = {
  label: string
  href: string
}