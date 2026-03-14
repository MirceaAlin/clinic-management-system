package com.example.backend.controller;

public record DoctorDTO(
        Long id,
        String firstName,
        String lastName,
        String specialization,
        String department
) {}
