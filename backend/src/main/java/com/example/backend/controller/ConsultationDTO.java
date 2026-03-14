package com.example.backend.controller;

public record ConsultationDTO(
        Long id,
        Long doctorId,
        Long patientId,
        String date,
        String reason,
        String status,
        String notes
) {}
