package com.example.backend.controller;

public record ConsultationRequest(
        Long doctorId,
        Long patientId,
        String date,
        String time,
        String reason
) {}
