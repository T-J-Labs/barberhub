package com.barbersaas.api.modules.tenant.service; // Confirme sua pasta

import com.barbersaas.api.modules.tenant.domain.Tenant;
import com.barbersaas.api.modules.tenant.domain.User;
import com.barbersaas.api.modules.tenant.dto.CreateUserDTO;
import com.barbersaas.api.modules.tenant.repository.TenantRepository;
import com.barbersaas.api.modules.tenant.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder; // Novo Import
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder; // 1. Declaramos a ferramenta

    // 2. Adicionamos ela no construtor para o Spring injetar
    public UserService(UserRepository userRepository,
                       TenantRepository tenantRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createOwner(CreateUserDTO data) {

        if (userRepository.existsByEmail(data.email())) {
            throw new IllegalArgumentException("Este e-mail já está cadastrado no sistema.");
        }

        Tenant tenant = tenantRepository.findById(data.tenantId())
                .orElseThrow(() -> new IllegalArgumentException("Barbearia não encontrada. ID inválido."));

        User user = new User();
        user.setName(data.name());
        user.setEmail(data.email());

        // 3. A Mágica Acontece Aqui! Encriptando antes de setar
        user.setPassword(passwordEncoder.encode(data.password()));

        user.setTenant(tenant);

        return userRepository.save(user);
    }
}