package com.barbersaas.api.modules.tenant.controller;

import com.barbersaas.api.modules.tenant.domain.Tenant;
import com.barbersaas.api.modules.tenant.dto.CreateTenantDTO;
import com.barbersaas.api.modules.tenant.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    @PostMapping
    public ResponseEntity<Tenant> create(@RequestBody CreateTenantDTO dto) {
        Tenant createdTenant = tenantService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTenant);
    }
}