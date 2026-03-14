package com.example.backend.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "admins")
public class Admin extends User {

    public Admin() {
        super();
    }

    public Admin(String firstName, String lastName, String email, String password, Role role) {
        super(firstName, lastName, email, password, role);
    }
}
