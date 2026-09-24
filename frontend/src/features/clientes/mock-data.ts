import type { ClientsData } from "./types"

export const clientsMock: ClientsData = {
  clients: [
    { id: "cli-001", name: "Lucas Almeida", phone: "(21) 99841-2040", email: "lucas.almeida@email.com", lastVisit: "Hoje, 09:00", appointments: 18, noShows: 0, totalSpent: "R$ 1.080", reputation: "Ótima", accountStatus: "Ativa" },
    { id: "cli-002", name: "Marcos Vinícius", phone: "(21) 99710-8821", email: "marcos.v@email.com", lastVisit: "Hoje, 10:00", appointments: 12, noShows: 1, totalSpent: "R$ 720", reputation: "Ótima", accountStatus: "Ativa" },
    { id: "cli-003", name: "João Pedro", phone: "(21) 99102-5508", email: "joao.pedro@email.com", lastVisit: "18 jun 2025", appointments: 9, noShows: 2, totalSpent: "R$ 495", reputation: "Regular", accountStatus: "Ativa" },
    { id: "cli-004", name: "Gustavo Oliveira", phone: "(21) 99803-4412", email: "gustavo.o@email.com", lastVisit: "17 jun 2025", appointments: 21, noShows: 0, totalSpent: "R$ 1.470", reputation: "Ótima", accountStatus: "Ativa" },
    { id: "cli-005", name: "Pedro Henrique", phone: "(21) 99618-7230", email: "pedro.h@email.com", lastVisit: "12 jun 2025", appointments: 6, noShows: 3, totalSpent: "R$ 330", reputation: "Atenção", accountStatus: "Ativa" },
    { id: "cli-006", name: "Bruno Ferreira", phone: "(21) 99218-0432", email: "bruno.f@email.com", lastVisit: "10 jun 2025", appointments: 14, noShows: 1, totalSpent: "R$ 910", reputation: "Regular", accountStatus: "Convite pendente" },
  ],
}