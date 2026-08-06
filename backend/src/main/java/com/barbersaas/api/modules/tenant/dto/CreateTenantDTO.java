package com.barbersaas.api.modules.tenant.dto;

public record CreateTenantDTO(
        String name,
        String subdomain,
        String logoUrl
) {
}