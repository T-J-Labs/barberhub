package com.barbersaas.api.modules.tenant.controller;

import com.barbersaas.api.modules.tenant.domain.Tenant;
import com.barbersaas.api.modules.tenant.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tenants") // Esta será a URL base!
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    @PostMapping
    public ResponseEntity<Tenant> create(@RequestBody Tenant tenant) {
        Tenant createdTenant = tenantService.create(tenant);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTenant);
    }
}