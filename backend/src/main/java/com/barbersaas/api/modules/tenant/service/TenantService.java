package com.barbersaas.api.modules.tenant.service;

import com.barbersaas.api.modules.tenant.domain.Tenant;
import com.barbersaas.api.modules.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;

    public Tenant create(Tenant tenant) {
        // Regra de negócio: verificar se o subdomínio já está em uso
        if (tenantRepository.existsBySubdomain(tenant.getSubdomain())) {
            throw new IllegalArgumentException("Este subdomínio já está em uso.");
        }

        return tenantRepository.save(tenant);
    }
}