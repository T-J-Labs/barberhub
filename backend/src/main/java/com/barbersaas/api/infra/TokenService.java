package com.barbersaas.api.infra; // Ajuste para a pasta que você escolheu!

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.barbersaas.api.modules.tenant.domain.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    // O Spring vai puxar aquela variável que você acabou de colocar no properties!
    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(User user) {
        try {
            // Escolhemos o algoritmo HMAC256 e passamos a nossa senha mestra
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("barbersaas-api") // Quem está emitindo
                    .withSubject(user.getEmail()) // A identificação do usuário
                    .withClaim("tenantId", user.getTenant().getId().toString()) // Bônus de SaaS: Já colocamos o ID da barbearia dentro do token!
                    .withExpiresAt(genExpirationDate()) // Tempo de validade
                    .sign(algorithm); // Assina e gera a String final

        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar o token JWT", exception);
        }
    }

    private Instant genExpirationDate() {
        // O token vai durar exatamente 2 horas. Depois disso o usuário tem que logar de novo.
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}