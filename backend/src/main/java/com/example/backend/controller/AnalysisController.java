package com.example.backend.controller;

import com.example.backend.domain.Analysis;
import com.example.backend.domain.Patient;
import com.example.backend.service.AnalysisService;
import com.example.backend.repository.PatientRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/analyses")
public class AnalysisController {

    private final AnalysisService service;
    private final PatientRepository patientRepository;

    public AnalysisController(AnalysisService service, PatientRepository patientRepository) {
        this.service = service;
        this.patientRepository = patientRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getAll() {
        return service.findAll().stream()
                .map(this::toMap)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(a -> ResponseEntity.ok(toMap(a)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<Map<String, Object>> getByPatient(@PathVariable Long patientId) {
        return service.findByPatientId(patientId).stream()
                .map(this::toMap)
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody AnalysisRequest req) {
        if (req.patientId() == null || req.testName() == null || req.testDate() == null) {
            return ResponseEntity.badRequest().body("patientId, testName și testDate sunt obligatorii.");
        }

        Patient patient = patientRepository.findById(req.patientId()).orElse(null);
        if (patient == null) return ResponseEntity.badRequest().body("Pacient negăsit.");

        Analysis analysis = new Analysis();
        analysis.setTestName(req.testName());
        analysis.setResult(req.result());
        analysis.setUnit(req.unit());
        analysis.setNormalRange(req.normalRange());
        analysis.setTestDate(LocalDate.parse(req.testDate()));
        analysis.setPatient(patient);

        Analysis saved = service.save(analysis);
        return ResponseEntity.ok(toMap(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Map<String, Object> toMap(Analysis a) {
        Map<String, Object> json = new LinkedHashMap<>();
        json.put("id",          a.getId());
        json.put("testName",    a.getTestName());
        json.put("result",      a.getResult());
        json.put("unit",        a.getUnit());
        json.put("normalRange", a.getNormalRange());
        json.put("testDate",    a.getTestDate() != null ? a.getTestDate().toString() : null);
        json.put("patientId",   a.getPatient() != null ? a.getPatient().getId() : null);
        return json;
    }
}
