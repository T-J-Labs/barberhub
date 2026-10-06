package com.barbersaas.api.modules.tenant.controller; // Confirme sua pasta

import com.barbersaas.api.modules.tenant.domain.User;
import com.barbersaas.api.modules.tenant.dto.CreateUserDTO;
import com.barbersaas.api.modules.tenant.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    // O Spring injeta o nosso Service aqui automaticamente
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/owner")
    public ResponseEntity<User> createOwner(@RequestBody @Valid CreateUserDTO data) {

        // Manda o Service fazer o trabalho pesado
        User createdUser = userService.createOwner(data);

        // Devolve pro frontend um Status 201 (Created) e os dados do usuário salvo
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }
}