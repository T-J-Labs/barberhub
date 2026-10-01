export type NavigationItem = {
  label: string
  /**
   * O item só recebe um destino quando a respectiva página já existe.
   * Isso evita que menus em construção levem o usuário a uma rota 404.
   */
  href?: string
}

export type NavigationConfig = {
  primary: readonly NavigationItem[]
  secondary: readonly NavigationItem[]
}

export type PublicNavigationItem = {
  label: string
  href: string
}
