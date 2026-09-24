export type ClientReputation = "Ótima" | "Regular" | "Atenção"
export type ClientAccountStatus = "Ativa" | "Convite pendente"

export type Client = {
  id: string
  name: string
  phone: string
  email: string
  lastVisit: string
  appointments: number
  noShows: number
  totalSpent: string
  reputation: ClientReputation
  accountStatus: ClientAccountStatus
}

export type ClientsData = {
  clients: Client[]
}