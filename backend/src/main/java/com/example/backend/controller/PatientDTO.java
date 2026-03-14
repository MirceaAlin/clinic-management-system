package com.example.backend.controller;

public record PatientDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String personalIdNumber,
        String address,
        String universityFaculty
) {}
