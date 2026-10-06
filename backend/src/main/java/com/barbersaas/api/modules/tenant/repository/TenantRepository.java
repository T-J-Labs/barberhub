package com.barbersaas.api.modules.tenant.repository;

import com.barbersaas.api.modules.tenant.domain.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, UUID> {

    // O Spring cria a query SQL automaticamente só de lermos esse nome!
    boolean existsBySubdomain(String subdomain);
}