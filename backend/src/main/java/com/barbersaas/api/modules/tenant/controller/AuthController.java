package com.barbersaas.api.modules.tenant.controller;

import com.barbersaas.api.infra.TokenService;
import com.barbersaas.api.modules.tenant.domain.User;
import com.barbersaas.api.modules.tenant.dto.LoginDTO;
import com.barbersaas.api.modules.tenant.dto.TokenResponseDTO;
import com.barbersaas.api.modules.tenant.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody @Valid LoginDTO data) {

        // Busca o usuário no banco
        User user = userRepository.findByEmail(data.email())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        // Confere a senha
        if (passwordEncoder.matches(data.password(), user.getPassword())) {
            // Se bater, gera o Token!
            String token = tokenService.generateToken(user);
            return ResponseEntity.ok(new TokenResponseDTO(token));
        }

        // Senha errada
        return ResponseEntity.status(401).build();
    }
}