package com.barbersaas.api.modules.tenant.service;

import com.barbersaas.api.modules.tenant.domain.Tenant;
import com.barbersaas.api.modules.tenant.dto.CreateTenantDTO;
import com.barbersaas.api.modules.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;

    public Tenant create(CreateTenantDTO dto) {
        // 1. Valida se o subdomínio já existe
        if (tenantRepository.existsBySubdomain(dto.subdomain())) {
            throw new IllegalArgumentException("Este subdomínio já está em uso.");
        }

        // 2. Constrói a entidade protegida
        Tenant tenant = Tenant.builder()
                .name(dto.name())
                .subdomain(dto.subdomain())
                .logoUrl(dto.logoUrl())
                .isActive(true) // O backend assume o controle! O frontend não manda isso.
                .build();

        // 3. Salva no banco de dados
        return tenantRepository.save(tenant);
    }
}