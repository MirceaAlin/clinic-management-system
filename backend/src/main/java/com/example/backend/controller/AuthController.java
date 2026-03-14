package com.example.backend.controller;

import com.example.backend.domain.*;
import com.example.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req.email() == null || req.password() == null) {
            return ResponseEntity.badRequest().body("Email și parola sunt obligatorii.");
        }

        User user = userRepository.findByEmail(req.email());
        if (user == null || !user.getPassword().equals(req.password())) {
            return ResponseEntity.status(401).body("Email sau parolă incorectă.");
        }

        return ResponseEntity.ok(new UserDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (req.email() == null || req.password() == null ||
                req.firstName() == null || req.lastName() == null) {
            return ResponseEntity.badRequest().body("Toate câmpurile sunt obligatorii.");
        }

        User existing = userRepository.findByEmail(req.email());
        if (existing != null) {
            return ResponseEntity.badRequest().body("Email-ul este deja înregistrat.");
        }

        Patient p = new Patient(
                req.firstName(), req.lastName(), req.email(), req.password(),
                Role.PATIENT, "", "", ""
        );
        userRepository.save(p);

        return ResponseEntity.ok(new UserDTO(
                p.getId(), p.getFirstName(), p.getLastName(),
                p.getEmail(), p.getRole().name()
        ));
    }
}

record LoginRequest(String email, String password) {}
record RegisterRequest(String firstName, String lastName, String email, String password) {}

record UserDTO(Long id, String firstName, String lastName, String email, String role) {}
