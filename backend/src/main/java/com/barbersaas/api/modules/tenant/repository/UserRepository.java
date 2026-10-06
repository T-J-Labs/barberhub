package com.barbersaas.api.modules.tenant.repository; // Confirme o nome da pasta

import com.barbersaas.api.modules.tenant.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // O Spring faz a mágica de buscar o e-mail no banco só lendo o nome desse método
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}