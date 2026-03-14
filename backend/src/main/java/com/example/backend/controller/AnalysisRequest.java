package com.example.backend.controller;

public record AnalysisRequest(
        String testName,
        String result,
        String unit,
        String normalRange,
        String testDate,
        Long patientId
) {}
