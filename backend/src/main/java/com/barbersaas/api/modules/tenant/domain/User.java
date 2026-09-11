package com.barbersaas.api.modules.tenant.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_users") // Nossa proteção contra a palavra reservada do Postgres!
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // Aqui acontece a mágica do Relacionamento!
    @ManyToOne
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;


    // Como você comentou que prefere não usar Lombok, lembre-se de
    // gerar os Getters e Setters, e o Construtor vazio aqui embaixo!

}